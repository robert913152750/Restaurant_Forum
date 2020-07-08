const db = require("../models");
const Comment = db.Comment;
let commentController = {
  //新增評論
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id,
    }).then((comment) => {
      res.redirect(`/restaurants/${req.body.restaurantId}`);
    });
  },
  //刪除評論(限管理員)
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id).then((comment) => {
      comment.destroy().then((comment) => {
        res.redirect(`/restaurants/${comment.RestaurantId}`);
      });
    });
  },
};

module.exports = commentController;
