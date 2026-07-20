function decodeHtml(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"');
}

export async function fetchQuestions(amount = 2) {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple&encoding=url3986`);
    const data = await response.json();
    return data.results.map(q => ({
        text: decodeHtml(decodeURIComponent(q.question)),
        answers: shuffleAnswers([
            ...q.incorrect_answers.map(a => decodeHtml(decodeURIComponent(a))),
            decodeHtml(decodeURIComponent(q.correct_answer))
        ]),
        correctAnswer: decodeHtml(decodeURIComponent(q.correct_answer))
    }));
}

function shuffleAnswers(answers) {
    return answers.sort(() => Math.random() - 0.5);
}