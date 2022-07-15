// Fix for NODE < v17.5.0
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
globalThis.fetch = fetch;

const { ReadQueryResult, connect } = require("@tableland/sdk");

const BASE_URI = "https://testnet.tableland.network/query?s=";

async function getAllArticles() {
  // Connect
  const connection = await connect({ network: "testnet" });
  const query = await connection.read(
    "SELECT * FROM unblogged_hackfs_80001_44;"
  );
  console.log(query);
  let articles = [];
  query.rows.forEach((row) => {
    articles.push(row);
  });
  console.log("🚀 | query.rows.forEach | articles", articles);
  return articles;
}

async function getOneArticle(articleId) {
  // Connect
  const connection = await connect({ network: "testnet" });
  const query = await connection.read(
    `SELECT * FROM unblogged_hackfs_80001_44 WHERE articleId = ${articleId};`
  );

  let article = query.rows[0];
  console.log("🚀 | getOneArticle | article", article);

  return article;
}

async function main() {
  console.log("asd");
  await getAllArticles();
  await getOneArticle(0);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
