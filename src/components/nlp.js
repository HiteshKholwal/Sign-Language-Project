import nlp from 'compromise';

export function preprocessTextForSignLanguage(sentence) {
  const original = sentence;
  sentence = sentence.toLowerCase();

  // Basic parsing
  let doc = nlp(sentence);

  // Approximate subject and object extraction (first and second noun)
  let subject = doc.nouns().eq(0).out('text'); // first noun
  let verb = doc.verbs().toInfinitive().out('text'); // verb in infinitive form
  let object = doc.nouns().eq(1).out('text'); // second noun

  let isNegative = doc.has('#Negative');
  let questionWord = extractQuestionWord(sentence);

  // Fallback to naive simplifier if extraction fails
  if (!subject || !verb || !object) {
    return fallbackSimplify(sentence, questionWord, isNegative);
  }

  // Build basic SOV
  let parts = [subject, object, verb];

  // Add "not" for negatives
  if (isNegative) {
    parts.splice(2, 0, 'not'); // Insert before verb
  }

  // Append question word if it's a question
  if (questionWord) {
    parts.push(questionWord);
  }

  return parts;
}

// Handle fallback with rule-based simplification
function fallbackSimplify(sentence, questionWord, isNegative) {
  const removeWords = ['is', 'am', 'are', 'the', 'a', 'an', 'of', 'to', 'and', 'in', 'on', 'do', 'does', 'did', 'have', 'has'];
  const negatives = ['not', 'never', "don't", "doesn't", "didn't", "can't", "won't"];
  const words = sentence.replace(/[.,!?]/g, '').split(' ');

  let result = words.filter(w => !removeWords.includes(w));
  
  // Move negation near end
  let neg = result.find(w => negatives.includes(w));
  if (neg) {
    result.splice(result.indexOf(neg), 1);
    result.push('not');
  }

  // Add question word if present
  if (questionWord) {
    result.push(questionWord);
  }

  return result;
}

// Extract common question words
function extractQuestionWord(sentence) {
  const qWords = ['what', 'where', 'who', 'when', 'why', 'how'];
  for (let word of qWords) {
    if (sentence.toLowerCase().startsWith(word)) return word;
  }
  return '';
}
