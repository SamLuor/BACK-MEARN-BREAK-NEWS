import {
  createNews,
  findAllNews,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.services.js";

export const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    await createNews({
      title,
      text,
      banner,
      user: req.userId,
    });

    return res.send(201);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 0;
    }

    const news = await findAllNews(limit, offset);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "There are no registered news" });
    }

    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        naame: item.user.name,
        username: item.user.usename,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res.status(400).send({ message: "There is no registered post" });
    }

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.usename,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    return res.send({ message: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (!news) {
      return res.status(400).send({ message: "Not found news" });
    }

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.usename,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no news with this title" });
    }

    return res.send({
      news: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.usename,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await byUserService(id);

    res.send({
      news: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.usename,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    const news = await findByIdService(id);

    if (String(news.user._id) !== String(req.userId.toHexString())) {
      return res.status(401).send({ message: "You didn't update this post" });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "Update sucessfully" });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const eraser = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (String(news.user.id) !== String(req.userId)) {
      return res.status(400).send({
        message: "You didn't delete this post",
      });
    }
    await eraseService(id);

    return res.send({ message: "News deleted sucessfully" });
  } catch (err) {}
};

export const likeNews = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const newsLiked = await likeNewsService(id, userId);

  if (newsLiked === null) {
    await deleteLikeNewsService(id, userId);
    return res.status(200).send({ message: "Like removed Sucessfully" });
  }

  res.send("Ok");
};
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Write a message to comment" });
    }

    await addCommentService(id, userId, comment);

    return res.send({ message: "Comment sucessfully completed!" });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const user = req.userId;

    const commentDeleted = await deleteCommentService(idNews, idComment, user);

    if (!commentDeleted) {
      return res.status(400).send({ message: "Deleted failed" });
    }

    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );

    if (!commentFinder) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (commentFinder.userId.toString() !== user.toString()) {
      return res.status(400).send({ message: "You can't delete this comment" });
    }

    return res.send({ message: "Comment sucessfully deleted" });
  } catch (err) {
    return res.send({ message: err.message });
  }
};
