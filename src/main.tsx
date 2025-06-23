import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeRanksFromFlair(ranks: { [key: string]: number }, userFlairText: string): string {
  let result = userFlairText;

  for (const rank of Object.keys(ranks)) {
    const escapedRank = escapeRegExp(rank);
    const pattern = new RegExp(`(?:\\s|^)${escapedRank}(?=\\s|$)`, 'gu');
    result = result.replace(pattern, '');
  }

  return result.trim().replace(/\s{2,}/g, ' ');
}


function getRank(ranks: { [key: string]: number }, totalKarma: number): string {
  let bestRank = '';
  let highestThreshold = -1;

  for (const [rank, threshold] of Object.entries(ranks)) {
    if (totalKarma >= threshold && threshold > highestThreshold) {
      highestThreshold = threshold;
      bestRank = rank;
    }
  }

  return bestRank;
}

function replacePlaceholders(template: string, values: Record<string, string | number>) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] !== undefined ? String(values[key]) : '');
}

Devvit.addTrigger({
  events: ['PostSubmit', 'PostDelete', 'CommentDelete', 'CommentSubmit', 'PostFlairUpdate'], 
  onEvent: async (event, context) => {
    const subreddit = await context.reddit.getCurrentSubredditName();
    const subredditId = await context.reddit.getSubredditByName(subreddit);

    if (event.author) {
      const user = event.author.name;
      const lock = await context.redis.get(user);
      console.log('Event Detected !');
      if(lock && lock === '1') {
        console.log('Mutex Lock detected, exiting!');
        return;
      }
      await context.redis.set(user, '1');
      await context.redis.expire(user, 60);
      
      const useroObj = await context.reddit.getUserByUsername(user);
      let permissions = [];
      if(useroObj) {
        permissions = await useroObj.getModPermissionsForSubreddit(subreddit);
      }

      let ranksList = await context.settings.get<string>('ranks-list');

      if (permissions.length > 0) {
        const excludeMods = await context.settings.get<boolean>('exclude-mods');
        if(excludeMods == true) {
          console.log('Mod detected, exiting!');
          return;
        } else {
          const modrank = await context.settings.get<string>('mod-rank');
          if(modrank) {
            ranksList = '{"'+modrank+'": 0}'
          }
        }
      }

      let ranks, colors;
      try {
        ranks = JSON.parse(ranksList);
      } catch (e) {
        return;
      }

      const commentsListing = await context.reddit.getCommentsByUser({ username: user, limit: 10000, timeframe: 'all' });
      const comments = await commentsListing.all();
      const postsListing = await context.reddit.getPostsByUser({ username: user, limit: 10000, timeframe: 'all' });
      const posts = await postsListing.all();

      let totalKarma = 0;
      const enableCommunityKarma = await context.settings.get<boolean>('enable-community-karma');
      for (const item of comments) {
        if (item.subredditName === subreddit) {
          totalKarma += item.score ?? 0;
          if(enableCommunityKarma == true) {
            totalKarma--;
          }
        }
      }
      for (const item of posts) {
        if (item.subredditName === subreddit) {
          totalKarma += item.score ?? 0;
          if(enableCommunityKarma == true) {
            totalKarma--;
          }
        }
      }

      const response = await subredditId.getUserFlair({usernames: [user]});
      const userFlairText = response.users[0].flairText ?? '';
      const flairCssClass = response.users[0].flairCssClass ?? '';

      let newrank = getRank(ranks, totalKarma);
      let flairText = newrank;

      if(userFlairText) {
        flairText = flairText + ' ' + removeRanksFromFlair(ranks, userFlairText);
        if(flairText === userFlairText) {
          console.log('No Changes, exiting!');
          return;
        }
      }

      let flair = {
        subredditName: subreddit,
        username: user,
        text: flairText,
        cssClass: flairCssClass
      }

      let lvlupSubject = await context.settings.get<string>('levelup-subject');
      let lvlupBody = await context.settings.get<string>('levelup-message');

      if(lvlupSubject && lvlupBody) {
        const placeholders = {
          subreddit: subreddit,
          karma: totalKarma,
          rank: newrank.replace(/:/g,''),
          user: user
        };

        lvlupSubject = replacePlaceholders(lvlupSubject, placeholders);
        lvlupBody = replacePlaceholders(lvlupBody, placeholders);
        await context.reddit.sendPrivateMessage({
          to: user,
          subject: lvlupSubject,
          text: lvlupBody,
        });
      }
      console.log(`${subreddit}: Trigger fired for user: ${user} in with ${totalKarma} current flair: ${userFlairText} CSS: ${flairCssClass} to ${flairText}`);

      await context.reddit.setUserFlair(flair);
      await context.redis.del(user);
    }
  },
});

export default Devvit;


Devvit.configure({
  redditAPI: true,
});


Devvit.addSettings([
  {
    type: 'boolean',
    name: 'enable-community-karma',
    label: 'Only count upvotes/downvotes',
    helpText: 'When enabled ranks will be calculated excluding initial upvote',
  },
  {
    type: 'paragraph',
    name: 'ranks-list',
    label: 'Ranks list',
    helpText: 'Eenter as JSON, e.g. {"rank1": 0, "rank2": 1}',
  },
  {
    type: 'paragraph',
    name: 'levelup-subject',
    label: 'Level Up Message Subject',
    helpText: 'Subject of an automated notification message on level-up. [Supported variables: ${user}, ${rank}, ${subreddit} and ${karma}]',
  },
  {
    type: 'paragraph',
    name: 'levelup-message',
    label: 'Level Up Message Body',
    helpText: 'Body of an automated notification message on level-up. [Supported variables: ${user}, ${rank}, ${subreddit} and ${karma}]',
  },
  {
    type: 'boolean',
    name: 'exclude-mods',
    label: 'Exclude moderators',
    helpText: 'When enabled all subreddit moderators will be excluded from ranking and can set their own rank manually',
  },
  {
    type: 'string',
    name: 'mod-rank',
    label: 'Moderator rank',
    helpText: 'If set all subreddit moderators will persistently get this rank',
  },
]);