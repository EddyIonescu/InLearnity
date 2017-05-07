var unirest = require('unirest');
var khan_exercises = require('./khan_exercises.json');
var fs = require('fs');

let videoObjects = [];
Promise.all(khan_exercises.reduce((acc, exercise) => {
    // http://www.khanacademy.org/api/v1/exercises/<exercise_name>/videos
    let exercise_name = exercise.node_slug.slice(2);
    return acc.concat(new Promise((resolve, reject) => {
        unirest.get(`http://www.khanacademy.org/api/v1/exercises/${exercise_name}/videos`)
            .end((response) => {
                let videos = response.body;
                videoObjects = videos.map((video) => {
                    return {
                        title: video.title,
                        description: video.description,
                        link: video.ka_url,
                    };
                }).concat(videoObjects);
                resolve();
            });
    }));
}, [])).then(() => {
    fs.writeFile('./khanVideos.json', JSON.stringify(videoObjects), 'utf-8');
});
