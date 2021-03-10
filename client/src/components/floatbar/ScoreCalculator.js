
function ScoreCalculator(commits, lines, issues) {
    let score = commits + lines + issues;
    return score;
}

export default ScoreCalculator;