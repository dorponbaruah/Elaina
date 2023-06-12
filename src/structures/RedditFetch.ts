import { typings } from "../index";
import fetch from "node-fetch";

export class RedditFetch {
  private _subreddit: string;
  private _over_18: boolean;
  private _postData: typings.IRedditPostData;
  private _subredditData: typings.ISubredditData;

  constructor(subreddits: string | string[], over_18 ? : boolean) {
    this._subreddit = (
      typeof subreddits === "string" ?
      subreddits :
      subreddits[Math.floor(Math.random() * subreddits.length)]
    );
    this._over_18 = over_18 ?? false;
  }

  private async fetchPostData() {
    return (await fetch(`https://reddit.com/r/${this._subreddit}.json?limit=100`).then(res => res.json())
      .then((body: typings.IRedditListing) => {
        let found = body.data.children;

        found = found.filter(p => {
          return !p.data.is_video && p.data.post_hint === "image" && !p.data.is_gallery;
        });

        if (!this._over_18) found = found.filter(p => !p.data.over_18);

        const index = Math.floor(Math.random() * found.length);

        const post = found[index]?.data;

        return { title: post?.title, post_url: post?.url.replace("gifv", "gif") } as typings.IRedditPostData;
      }));
  }

  private async fetchSubredditData() {
    return (await fetch(`https://www.reddit.com/r/${this._subreddit}/about.json`).then(res => res.json())
      .then((body: typings.ISubredditAbout) => {
        const icon = (
          body.data.community_icon !== "" ?
          body.data.community_icon.replace(/(.*?(?:jpg|png|jpeg))|.*/gm, "$1") :
          "https://media.discordapp.net/attachments/911913215175311411/1009746249366376458/PicsArt_08-18-02.20.43.png"
        );

        return { name: body.data.display_name_prefixed, icon_url: icon } as typings.ISubredditData;
      }));
  }

  public async makeRequest() {
    try {
      this._postData = await this.fetchPostData();
      this._subredditData = await this.fetchSubredditData();
    }
    catch (error) {
      console.log(error.name+" "+error.message+" | Subreddit: "+this._subreddit);
      return false;
    }
  }

  public get getPostTitle(): string {
    return (typeof this._postData.title === "string" ? this._postData.title : "");
  }

  public get getPostImage(): string {
    return this._postData.post_url;
  }

  public get getSubredditName(): string {
    return this._subredditData.name;
  }

  public get getSubredditIcon(): string {
    return this._subredditData.icon_url;
  }
}