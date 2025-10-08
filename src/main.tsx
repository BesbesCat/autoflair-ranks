import { Devvit, RichTextBuilder } from '@devvit/public-api';
import {
  escapeRegExp,
  removeRanksFromFlair,
  getRank,
  replacePlaceholders,
  sleep,
  getRandomDelay,
  removeOldFromFlair,
  getCurrRank,
  getBonusPoints
} from './utils/functions';


Devvit.configure({
  redditAPI: true,
});

Devvit.addTrigger({
  events: ['PostSubmit', 'PostDelete', 'CommentDelete', 'CommentCreate'], 
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
      await context.redis.set(`${event.author.id}-karma`, `${totalKarma}`);

      let extra = parseInt(await context.redis.get(`${event.author.id}-extra`) ?? '0', 10);
      totalKarma += extra;
      console.log(`${user}: Total Karma + ${extra} = ${totalKarma}`);

      const response = await subredditId.getUserFlair({usernames: [user]});
      const userFlairText = response.users[0].flairText ?? '';
      const flairCssClass = response.users[0].flairCssClass ?? '';
      console.log(`${user}: Initial Flair = "${userFlairText}" / CSS = "${flairCssClass}"`);
      let removeList = settings['remove-list'] as string;
      let cleanFlairText = userFlairText;
      if(removeList) {
        console.log(`${user}: removeList = ${removeList}`);
        let remove = JSON.parse(removeList);
        cleanFlairText = removeOldFromFlair(remove, userFlairText);
        console.log(`${user}: cleanFlairText = ${cleanFlairText}`);
      }

      let newrank = getRank(ranks, totalKarma);
      let flairText = newrank;
      const rankDir = await context.settings.get('rank-direction') ?? 'prepend';
      if(cleanFlairText) {
        if(rankDir == 'append') {
          flairText = removeRanksFromFlair(ranks, cleanFlairText) + ' ' + flairText;
        } else {
          flairText = flairText + ' ' + removeRanksFromFlair(ranks, cleanFlairText);
        }
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

Devvit.addTrigger({
  events: ['CommentCreate'], 
  onEvent: async (event, context) => {
    const subredditId = await context.reddit.getCurrentSubreddit();
    const subreddit = subredditId.name;
    const settings = await context.settings.getAll();
    if(event.comment && event.author && event.post) {
      const commentBody = event.comment.body;
      const user = event.author.name;
      console.log(`${user}: New Comment - ${commentBody}`);
      let ranksList = settings['ranks-list'] as string;
      let ranks;
      try {
        ranks = JSON.parse(ranksList);
      } catch (e) {
        return;
      }
      const response = await subredditId.getUserFlair({usernames: [user]});
      const userFlairText = response.users[0].flairText ?? '';
      let currentRank = getCurrRank(ranks, userFlairText);
      const useroObj = await context.reddit.getUserByUsername(user);
      let permissions = [];
      if(useroObj) {
        permissions = await useroObj.getModPermissionsForSubreddit(subreddit);
        console.log(`${user}: permissions = ${permissions}`);
      }
      if (permissions.length > 0) {
        currentRank = 'mod';
      }
      if(currentRank) {
        console.log(`${user}: Current Rank - ${currentRank}`);
        let bonusList = settings['bonus-keywords'] as string;
        let bonus;
        try {
          bonus = JSON.parse(bonusList);
          console.log(`${user}: Bonus Keywords - ${bonusList}`);
        } catch (e) {
          return;
        }
        let bonusPoints = getBonusPoints(bonus, currentRank, commentBody);
        console.log(`${user}: Bonus Points = ${bonusPoints}`);
        const opUserID = await context.reddit.getUserById(event.post.authorId);
        if ((opUserID && opUserID.id != event.author.id && bonusPoints > 0) || (bonusPoints === "info")) {
          const opUsername = opUserID.id;
          let lock = await context.redis.get(`${opUsername}-${event.author.id}-${event.post.id}`);

          if(lock === "1" && bonusPoints != "info") {
            console.log(`${user}: Bonus duplicate - exiting!`);
            return;
          }
          if(bonusPoints === "info") {
            bonusPoints = 0;
          } else {
            await context.redis.set(`${opUsername}-${event.author.id}-${event.post.id}`, "1");
          }
          console.log(`${user}: Bonus OP - ${opUsername}`);
          let extra = parseInt(await context.redis.get(`${opUsername}-extra`) ?? '0', 10);
          extra += bonusPoints;
          await context.redis.set(`${opUsername}-extra`, `${extra}`);
          const totalKarma = await context.redis.get(`${opUsername}-karma`) ?? "0";
          let bonusComment = settings['bonus-comment'] as string;
          if(bonusComment) {
            const totalScore = parseInt(totalKarma) + extra;
            const placeholders = {
              user: opUserID.username,
              karma: totalKarma,
              points: bonusPoints,
              totalExtra: extra,
              totalScore: totalScore
            };
            const replytext = replacePlaceholders(bonusComment, placeholders);
            const reply = new RichTextBuilder().heading({ level: 3 }, (h) => {
              h.rawText(replytext);
            }).horizontalRule();
            await context.reddit.submitComment({
              id: event.comment.id,
              richtext: reply,
            });
          }
          console.log(`${user}: Total Bonus Points = ${extra}`);
        }
      }
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
    type: 'select',
    name: 'rank-direction',
    label: 'Add rank before or after existing flair',
    options: [
      {
        label: 'Before',
        value: 'prepend',
      },
      {
        label: 'After',
        value: 'append',
      },
    ],
    multiSelect: false,
  },
  {
    type: 'paragraph',
    name: 'ranks-list',
    label: 'Ranks list',
    helpText: 'JSON list of ranks and karma, e.g. {"rank1": 0, "rank2": 1}',
  },
  {
    type: 'paragraph',
    name: 'bonus-keywords',
    label: 'Karma Bonus Keywords',
    helpText: 'JSON list of keywords and ranks with corresponding points to be added (or substracted if negative) to OP\'s score when used in a comment, e.g. {  "!woo": {"rank1": 0, "rank2": 1, "mod": 10},  "!boo": {"rank1": 0, "rank2": -1, "mod": 10}}',
  },
  {
    type: 'paragraph',
    name: 'bonus-comment',
    label: 'Karma Bonus Comment',
    helpText: 'Body of an automated comment to be added when a bonus keyword is used [Supported variables: ${user}, ${points}, ${karma}, ${totalExtra} and ${totalScore}]',
  },
  {
    type: 'paragraph',
    name: 'remove-list',
    label: 'Remove list',
    helpText: 'JSON array of words to be removed from ranks, e.g. ["oldrank1", "oldrank2"]',
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
