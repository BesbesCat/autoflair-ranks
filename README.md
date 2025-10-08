


## Add a ranking system to your subreddit with user flairs based on community karma (Works with existing users flairs).

## Usage

After installation go to Ranks list from Installation Settings and enter your ranks under "Ranks list"

## Configuration

**Only count upvotes/downvotes:**
By default a Reddit post or comment will have an initial upvote.
When this setting is enabled the system will not count that initial upvote for posts and comments.

**Ranks list:**
Ranks are defined in JSON format. Make sure you enter a valid JSON as following:

    {"Noob": 0, "Beginner": 10, "Advanced": 100, "Expert": 1000, "God-Like": 10000}

Where key is the string to be added to user's flair and value is it's corresponding karma score.

**Karma Bonus Keywords:**
JSON list of keywords and ranks with corresponding points to be added (or substracted if negative) to OP\'s score when used in a comment
This feature allows users to award a bonus to be added to OP's score thus helping the user obtain a higher rank.
Make sure you enter a valid JSON as following:

    { "!woo": {"rank1": 0, "rank2": 1, "mod": 10}, "!boo": {"rank1": 0, "rank2": -1, "mod": 10}, "!info": {"rank1": "info", "rank2": "info", "mod": "info"}}}

**Karma Bonus Comment:**
Body of an automated comment to be added when a bonus keyword is used [Supported variables: ${user}, ${points}, ${karma}, ${totalExtra} and ${totalScore}]

**Remove list:**
This is used clean up old ranks from flairs or to set a list of words to be removed entirely from the flair.
It must be defined as a JSON Array (Not a JSON Object):

    ["oldRank1", "oldRank2", "prohibitedWord"]

**Level Up Message Subject:**
Subject of an automated notification message on level-up. [Supported variables: ${user}, ${rank}, ${subreddit} and ${karma}]

**Level Up Message Body:**
Body of an automated notification message on level-up. [Supported variables: ${user}, ${rank}, ${subreddit} and ${karma}]

**Exclude moderators:**
When enabled all subreddit moderators will be excluded from ranking and can set their own rank manually.

**Moderator rank:**
If set all subreddit moderators will persistently get this rank. Just enter the rank text (No JSON is needed).

## Notes

 - To retain flair color, You must define a unique flair css style under 
    **subreddit Settings** > **Look and Feel** > **User Flair** > **Edit flair** > Then Enable **CSS class name** and enter a unique class name
   
 - Any string you define as a rank title will be removed from existing user flairs and cannot be used by users anymore in their flair.
 - Adding a keword such as: "!info": {"rank1": "info", "rank2": "info", "mod": "info"} will allow users to query OP's points breakdown.
 - Custom emojis will work with this app.
 - You need to make sure user flair is enabled for your subreddit for this app to work at all.
 - "Exclude moderators" will fully exit once a moderator permission is detected. Allowing each mod to set their custom rank individually.
 - "Moderator rank" will set a global rank for all mods that cannot be changed manually. You must disable "Exclude moderators" for this to work at all.

## Source Code
You can obtain the code for this app from [here](https://github.com/BesbesCat/autoflair-ranks).