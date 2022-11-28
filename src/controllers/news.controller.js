import { createNews, findAllNews } from "../services/news.services.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      return res.status(400).send({
        message: "Submit all fields for registration",
      });
    }

    await createNews({
      title,
      text,
      banner,
      user: "6383749428e61ac36a44df52",
    });

    return res.send(201);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    const news = await findAllNews();

    if (news.length === 0) {
      res.status(400).send({ message: "There are no registered news" });
    }

    res.send(news);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export { create, findAll };
