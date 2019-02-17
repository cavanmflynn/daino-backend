import fetch from 'node-fetch';

export class Github {
  private static readonly _apiBase = 'https://api.github.com';

  /**
   * Get a new github client instance for a specific user
   * @param tokenKey The oauth token key
   */
  public static client(tokenKey: string) {
    return {
      getUsernameWithAccessToken: async () => {
        const result = await fetch(
          `${this._apiBase}/user?access_token=${tokenKey}`,
          {
            method: 'get',
          },
        );
        const json = await result.json();
        return json.login;
      },
    };
  }
}
