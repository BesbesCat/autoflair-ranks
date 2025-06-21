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

Devvit.addTrigger({
  events: ['PostSubmit', 'PostDelete', 'CommentDelete', 'CommentSubmit'], 
  onEvent: async (event, context) => {
    const subreddit = await context.reddit.getCurrentSubredditName();
    if (event.author) {
      const user = event.author.name;
      const subredditId = await context.reddit.getSubredditByName(subreddit);
      const response = await subredditId.getUserFlair({usernames: [user]});
      const userFlairText = response.users[0].flairText ?? '';
      const flairCssClass = response.users[0].flairCssClass ?? '';
      const ranksList = await context.settings.get<string>('ranks-list');
      let ranks, colors;
      try {
        ranks = JSON.parse(ranksList);
      } catch (e) {

      }

      console.log(`Trigger fired for user: ${user} in subreddit: ${subreddit} with current flair ${userFlairText} ${flairCssClass}`);

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
      let flairText = getRank(ranks, totalKarma);

      if(userFlairText) {
        flairText = flairText + ' ' + removeRanksFromFlair(ranks, userFlairText);
      }

      let flair = {
        subredditName: subreddit,
        username: user,
        text: flairText,
        cssClass: flairCssClass
      }
      
      console.log(`Karma ${totalKarma} with flair: ${flairText}`);

      await context.reddit.setUserFlair(flair);    
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
    label: 'Enable community karma',
  },
  {
    type: 'paragraph',
    name: 'ranks-list',
    label: 'Ranks list (enter as JSON, e.g. {"rank1": 0, "rank2": 1})',
  },
]);