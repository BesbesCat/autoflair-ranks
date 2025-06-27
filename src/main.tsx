import { Devvit } from '@devvit/public-api';
import {
  escapeRegExp,
  removeRanksFromFlair,
  getRank,
  replacePlaceholders,
  sleep,
  getRandomDelay
} from './utils/functions';


Devvit.configure({
  redditAPI: true,
});

Devvit.addTrigger({
  events: ['PostSubmit', 'PostDelete', 'CommentDelete', 'CommentSubmit'], 
  onEvent: async (event, context) => {
    const subredditId = await context.reddit.getCurrentSubreddit();
    const subreddit = subredditId.name;
    const settings = await context.settings.getAll();

    if (event.author) {
      const delay = getRandomDelay(0.1, 1);
      console.log(`Waiting for ${delay / 1000} seconds...`);
      await sleep(delay);
      const user = event.author.name;
      const lock = await context.redis.get(user);
      console.log(`${user}: Event Detected`);

      if(lock && lock === '1') {
        console.log(`${user}: Mutex Lock detected, exiting!`);
        return;
      }

      await context.redis.set(user, '1');
      await context.redis.expire(user, 60);
      
      const useroObj = await context.reddit.getUserByUsername(user);
      console.log(`${user}: User object loaded`);
      let permissions = [];
      if(useroObj) {
        permissions = await useroObj.getModPermissionsForSubreddit(subreddit);
        console.log(`${user}: permissions = ${permissions}`);
      }

      let ranksList = settings['ranks-list'] as string;
      console.log(`${user}: ranksList = ${ranksList}`);

      if (permissions.length > 0) {
        const excludeMods = settings['exclude-mods'] as boolean;
        if(excludeMods == true) {
          console.log(`${user}: Mod detected, exiting!`);
          return;
        } else {
          const modrank = settings['mod-rank'] as string;
          console.log(`${user}: modrank = ${modrank}`);
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

      const posts = await context.reddit.getCommentsAndPostsByUser({ username: user, limit: 10000, timeframe: 'all' }).all();
      console.log(`${user}: Posts/Comments loaded`);

      let totalKarma = 0;

      const enableCommunityKarma = settings['enable-community-karma'] as boolean;
      console.log(`${user}: enableCommunityKarma = ${enableCommunityKarma}`);

      for (const item of posts) {
        if (item.subredditName === subreddit) {
          totalKarma += item.score ?? 0;
          if(enableCommunityKarma == true) {
            totalKarma--;
          }
        }
      }
      console.log(`${user}: Total Karma = ${totalKarma}`);

      const response = await subredditId.getUserFlair({usernames: [user]});
      const userFlairText = response.users[0].flairText ?? '';
      const flairCssClass = response.users[0].flairCssClass ?? '';
      console.log(`${user}: Initial Flair = "${userFlairText}" / CSS = "${flairCssClass}"`);

      let newrank = getRank(ranks, totalKarma);
      let flairText = newrank;

      if(userFlairText) {
        flairText = flairText + ' ' + removeRanksFromFlair(ranks, userFlairText);
        if(flairText.replace(/ /g,'') === userFlairText.replace(/ /g,'')) {
          console.log(`${user}: No Changes, exiting!`);
          return;
        }
      }

      let flair = {
        subredditName: subreddit,
        username: user,
        text: flairText,
        cssClass: flairCssClass
      }
      console.log(`${user}: New Flair = "${flairText}" / CSS = "${flairCssClass}"`);

      let lvlupSubject = settings['levelup-subject'] as string;
      let lvlupBody = settings['levelup-message'] as string;

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
      console.log(`${user}: Message sent`);

      await context.reddit.setUserFlair(flair);
      console.log(`${user}: Flair changed`);
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