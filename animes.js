/*
const goyabu = require("./animes");

goyabu.animeSearch('dragon ball super').then(results => {
    console.log(results)
});
*/

const request = require("request"),
  cheerio = require("cheerio");

exports.animeSearch = function (query) {
  return new Promise(function (resolve, reject) {
    //https://animesonline.org [SITE ABRE VIDEOS EM OUTRO NAVEGADOR]
    //https://animesfalse.net [SITE ABRE VIDEOS EM OUTRO NAVEGADOR]
    //https://animes.vision
    //https://animefire.net
    //https://donghuanosekai.com
/*request("https://animesfalse.net/", function (error, response, body) {
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/
    request("https://animes.vision/search?nome=" + query, function (error, response, body) {
      //console.log(body)
      if (error) {
        reject(Error(error));
      } else {
        var $ = cheerio.load(body, {
          xml: {
            normalizeWhitespace: true,
            decodeEntities: true, // Decode HTML entities.
            withStartIndices: false, // Add a `startIndex` property to nodes.
            withEndIndices: false, // Add an `endIndex` property to nodes.
          },
        });

        var animeUrl = [];
        $(".film-poster aa").each(function (index, element) {
          animeUrl.push($(element).attr("href"));
        });
        if (!animeUrl || !animeUrl[0]) return console.log('Anime não encontrado')
        request(animeUrl[0], function (error, response, body) {
          if (error) {
            reject(Error(error));
          } else {
            var $ = cheerio.load(body, {
              xml: {
                normalizeWhitespace: true,
                decodeEntities: true, // Decode HTML entities.
                withStartIndices: false, // Add a `startIndex` property to nodes.
                withEndIndices: false, // Add an `endIndex` property to nodes.
              },
            });

            var animeInfosRaw = [];
            $(".anime-info-right div").each(function (index, element) {
              animeInfosRaw.push($(element).text());
            });

            var animeTitleRaw = `${animeInfosRaw[0]}`.replace(" ", "");

            const title = animeTitleRaw,
              episodes = parseFloat(
                animeInfosRaw[1].replace("tag Episódios: ", "")
              ),
              views = parseFloat(animeInfosRaw[2].replace("tag Views: ", "")),
              alternativeName = animeInfosRaw[3].replace(
                "tag Nome Alternativo: ",
                ""
              ),
              status = animeInfosRaw[4].replace("tag Status: ", ""),
              animeGenresRaw = animeInfosRaw[5].replace("tag Generos: ", ""),
              genres = `${animeGenresRaw}`.split(", ");

            var description = [];
            $(".anime-description").each(function (index, element) {
              description.push($(element).text());
            });

            var animeCoverUrlRaw = [];
            $(".anime-cover-left-holder img").each(function (index, element) {
              animeCoverUrlRaw.push($(element).attr("src"));
            });

            const coverUrl = `${animeCoverUrlRaw}`.replace(/,/g, "");

            var results = {
              title,
              episodes,
              views,
              alternativeName,
              status,
              genres,
              description,
              coverUrl,
            };

            resolve(results);
          }
        });
      }
    });
  });
};