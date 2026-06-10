const fs = require("fs");
const path = require("path");
const https = require("https");

const baseConfig = require("./site-data.config").default;

const localConfigPath = path.join(__dirname, "site-data.config.local.js");
const localConfig = fs.existsSync(localConfigPath)
  ? require(localConfigPath)
  : {};

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function mergeConfig(target, source) {
  if (!isPlainObject(source)) {
    return target;
  }

  return Object.keys(source).reduce(
    (result, key) => {
      const currentValue = result[key];
      const nextValue = source[key];

      if (isPlainObject(currentValue) && isPlainObject(nextValue)) {
        return {
          ...result,
          [key]: mergeConfig(currentValue, nextValue)
        };
      }

      return {
        ...result,
        [key]: nextValue
      };
    },
    {...target}
  );
}

const siteDataConfig = mergeConfig(baseConfig, localConfig);
const githubConfig = siteDataConfig.github || {};
const mediumConfig = siteDataConfig.medium || {};

const ERR = {
  missingGithubConfig:
    "GitHub sync requires both github.username and github.token in site-data.config.js or site-data.config.local.js.",
  requestFailed:
    "The request to GitHub didn't succeed. Check if the GitHub token in your configuration file is correct.",
  requestFailedMedium:
    "The request to Medium didn't succeed. Check if Medium username in your configuration file is correct."
};
if (githubConfig.enabled) {
  if (!githubConfig.username || !githubConfig.token) {
    throw new Error(ERR.missingGithubConfig);
  }

  console.log(`Fetching profile data for ${githubConfig.username}`);
  var data = JSON.stringify({
    query: `
{
  user(login:"${githubConfig.username}") { 
    id
    name
    bio
    avatarUrl
    location
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
          node {
            ... on Repository {
              name
              description
              forkCount
              stargazers {
                totalCount
              }
              url
              id
              diskUsage
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
}
`
  });
  const default_options = {
    hostname: "api.github.com",
    path: "/graphql",
    port: 443,
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubConfig.token}`,
      "User-Agent": "Node"
    }
  };

  const req = https.request(default_options, res => {
    let data = "";

    console.log(`statusCode: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      throw new Error(ERR.requestFailed);
    }

    res.on("data", d => {
      data += d;
    });
    res.on("end", () => {
      fs.writeFile("./public/profile.json", data, function (err) {
        if (err) return console.log(err);
        console.log("saved file to public/profile.json");
      });
    });
  });

  req.on("error", error => {
    throw error;
  });

  req.write(data);
  req.end();
}

if (mediumConfig.enabled) {
  if (!mediumConfig.username) {
    throw new Error(ERR.requestFailedMedium);
  }

  console.log(`Fetching Medium blogs data for ${mediumConfig.username}`);
  const options = {
    hostname: "api.rss2json.com",
    path: `/v1/api.json?rss_url=https://medium.com/feed/@${mediumConfig.username}`,
    port: 443,
    method: "GET"
  };

  const req = https.request(options, res => {
    let mediumData = "";

    console.log(`statusCode: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      throw new Error(ERR.requestFailedMedium);
    }

    res.on("data", d => {
      mediumData += d;
    });
    res.on("end", () => {
      fs.writeFile("./public/blogs.json", mediumData, function (err) {
        if (err) return console.log(err);
        console.log("saved file to public/blogs.json");
      });
    });
  });

  req.on("error", error => {
    throw error;
  });

  req.end();
}
