var khan_videos = require('./khanVideos.json');
var khan_exercises = require('./khan_exercises.json');
var udacity = require('./udacity_courses.json');

var search = (query, callback, context) => {
    let keys = query.split(' ');
    const results = searchUdacity(keys, 4).concat(searchKhanExercises(keys, 1).concat(searchKhanVideos(keys, 1)));
    callback(null,
        {
            statusCode: 200,
            body: JSON.stringify(results)
        });
}
module.exports = search;

function searchKhanExercises(keys, n) {
    return khan_exercises.map((exercise) => {
        return {
            title: exercise.title,
            description: exercise.description,
            link: exercise.ka_url,
            score: getScore(keys, exercise.title) + getScore(keys, exercise.description),
        };
    }).sort((exercise1, exercise2) => {
        return exercise2.score - exercise1.score;
    }).slice(0, n);
}

function searchKhanVideos(keys, n) {
    return khan_videos.map((video) => {
        return {
            title: video.title,
            description: video.description,
            link: video.ka_url,
            score: getScore(keys, video.title) + getScore(keys, video.description),
        };
    }).sort((video1, video2) => {
        return video2.score - video1.score;
    }).slice(0, n);
}

function searchUdacity(keys, n) {
    courses = udacity.courses.map((course) => {
        let searchProps = [
            'subtitle',
            'expected_learning',
            'title',
            'syllabus',
            'summary',
            'short_summary'];
        let title = course['title'];
        let link = course['homepage'];
        let summary = course['summary'];
        let image = course['image'];
        let score = searchProps.reduce((acc, prop) => {
            return getScore(keys, course[prop]) + acc;
        }, 0);
        return {
            title: title,
            link: link,
            summary: summary,
            image: image,
            score: score,
        };
    });
    return courses.sort((course1, course2) => {
        return course2.score - course1.score;
    }).slice(0, n);
}

function getScore(keys, text) {
    let score = 0;
    let textKeys = text.split(' ');
    for (textKey in textKeys) {
        for (key in keys) {
            if (keys[key].length > 2 && keys[key].toUpperCase() === textKeys[textKey].toUpperCase()) {
                score++;
            }
        }
    }
    return score;
}
