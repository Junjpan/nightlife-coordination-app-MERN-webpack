const router = require('express').Router();
const Bar = require('../models/bar');

router.post('/comments/:id', (req, res) => {
    const barid = req.params.id;
    const { comments, user } = req.body;
    const date = new Date();
    const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const query = { barid: barid }
    if (comments == null) {//when you cancel prompt message, the variable for the comment will be null 
        res.status(200).send("This is an empty comment")
    } else {
        Bar.findOne(query, (err, bar) => {
            if (bar == null) {
                var newBar = new Bar();
                newBar.barid = barid;
                newBar.comments = [{ user: user, comments: comments, date: dateformat }];
                newBar.save((err) => {
                    if (err) { console.log(err) }
                    //console.log(newBar)
                })

            } else {
                bar.comments.push({ user: user, comments: comments, date: dateformat });
                bar.save((err) => {
                    if (err) { console.log(err) }
                });
                //console.log(bar);
            }
            res.send("comments was added!")
        })

    }

})

router.get('/comments/:id', (req, res) => {
    const barid = req.params.id;
    const query = { barid: barid };
    Bar.findOne(query, (err, bar) => {
        if (bar === null || bar.comments.length === 0) {
            res.json({ message: "There is no comment for this bar." })
        } else {
            res.json({
                message: `** ${bar.comments.length} comments`,
                comments: bar.comments,
                
            })
        }
    })
})


module.exports = router;