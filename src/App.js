import { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import bot from "./bot.jpg";

import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from "./styles";

const alanKey =
  "ae14f2dc41ea708cc055a67c4b0bdeb92e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  // -1 works for some reason 0 reads the previous one
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();

  useEffect(() => {
    // will only run once on initialisation
    const alanBtnInstance = alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          // when search again need to reset back to original
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;

          const article = articles[parsedNumber - 1];
          if (parsedNumber > articles.length) {
            // console.log(parsedNumber,);
            alanBtnInstance.playText("Sorry that article does not exist...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtnInstance.playText("Opening...");
          }
        }
      },
    });
  }, []);

  return (
    <div>
      {newsArticles.length === 0 && (
        <div className={classes.logoContainer}>
          <img src={bot} className={classes.alanLogo} alt="alan-logo" />
        </div>
      )}
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
};

export default App;
