const mongoose = require('mongoose');
mongoose.connect(process.env.dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, error => {
  if (error) {
    console.log(`[Animes WebSite] => Erro na DataBase: ${error}`);
    return process.exit(1);
  }
  return console.log(`[Animes WebSite] => Database Connected!`);
});

var MoldeEps = new mongoose.Schema({
  _id: String,
  name: String,
  date: String,
  thumb: String,
  src: String,
  download: String,
  introStart: Number,
  introEnd: Number,
  endEp: Number,
})
var MoldeSeasons = new mongoose.Schema({
  _id: String,
  name: String,
  eps: [MoldeEps],
})
var MoldeBase = new mongoose.Schema({ _id: String })
var MoldeAnimes = new mongoose.Schema({
  _id: String,
  name: String,
  othersNames: String,
  date: String,
  studios: String,
  thumb: String,
  genders: [MoldeBase],
  sinopse: String,
  likes: Number,
  completed: String,
  seasons: [MoldeSeasons],
  posted: String,
})

var AnimeSchema = new mongoose.Schema({
  _id: String,
  animes: [MoldeAnimes]
})

var Animes = mongoose.model('Animes', AnimeSchema)
exports.Animes = Animes