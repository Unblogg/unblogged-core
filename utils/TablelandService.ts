import { ReadQueryResult, connect } from "@tableland/sdk";

type Article = {
  articleId: Number;
  title: String;
  tag_1: String;
  tag_2: String;
  tag_3: String;
  author: String;
  ipfsCid: String;
};

// Turn array into article type
const formatArticle = (input: any[]): Article => {
  let article: Article = {
    articleId: input[0],
    title: input[1],
    tag_1: input[2],
    tag_2: input[3],
    tag_3: input[4],
    author: input[5],
    ipfsCid: input[6],
  };
  return article;
};

const getAllArticles = async (): Promise<Article[]> => {
  // Connect
  const connection = await connect({ network: "testnet" });
  const query: ReadQueryResult = await connection.read(
    "SELECT * FROM unblogged_hackfs_80001_44;"
  );
  console.log(query);
  let articles: Article[] = [];
  query.rows.forEach((row: any[]) => {
    articles.push(formatArticle(row));
  });
  console.log("🚀 | query.rows.forEach | articles", articles);
  return articles;
};

const getOneArticle = async (articleId: string | number): Promise<Article> => {
  // Connect
  const connection = await connect({ network: "testnet" });
  const query: ReadQueryResult = await connection.read(
    `SELECT * FROM unblogged_hackfs_80001_44 WHERE articleId = ${articleId};`
  );

  let article: Article = formatArticle(query.rows[0]);

  return article;
};

module.exports = {
  getAllArticles,
  getOneArticle,
};

// for testing
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
