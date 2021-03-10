
function ScoreCalculator(commits, lines, issues) {
    var score = commits + lines + issues;
    return score;
}

export default ScoreCalculator;