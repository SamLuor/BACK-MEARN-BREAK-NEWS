import News from "../models/News.js";

const createNews = (body) => News.create(body);

const findAllNews = () => News.find();

export { createNews, findAllNews };
