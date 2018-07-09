var path = require('path');

module.exports = {
  pinker: {
    asin: 'B000QCTNIM',
    title: 'The Blank Slate: The Modern Denial of Human Nature',
    authors: 'Steven Pinker',
    homeFile: path.resolve('test', 'data', 'B000QCTNIM-blank-slate__HOME.html'),
    htmlFile: path.resolve('test', 'data', 'B000QCTNIM-blank-slate__HTML.html'),
    highlightsFiles: [
      path.resolve('test', 'data', 'B000QCTNIM-blank-slate__HIGHLIGHTS_1.html'),
      path.resolve('test', 'data', 'B000QCTNIM-blank-slate__HIGHLIGHTS_2.html'),
      path.resolve('test', 'data', 'B000QCTNIM-blank-slate__HIGHLIGHTS_3.html')
    ],
    highlightsCount: 5,
    highlights: [
      // Highlights without notes
      {
        text:
          'To acknowledge human nature, many think, is to endorse racism, sexism, war, greed, genocide, nihilism, reactionary politics, and neglect of children and the disadvantaged. Any claim that the mind has an innate organization strikes people not as a hypothesis that might be incorrect but as a thought it is immoral to think.',
        location: {
          url: 'kindle://book?action=open&asin=B000QCTNIM&location=157',
          value: 157
        },
        isNoteOnly: false,
        note: null
      },
      {
        text:
          'I believe that controversies about policy almost always involve tradeoffs between competing values, and that science is equipped to identify the tradeoffs but not to resolve them. Many of these tradeoffs, I will show, arise from features of human nature, and by clarifying them I hope to make our collective choices, whatever they are, better informed. If I am an advocate, it is for discoveries about human nature that have been ignored or suppressed in modern discussions of human affairs.',
        location: {
          url: 'kindle://book?action=open&asin=B000QCTNIM&location=171',
          value: 171
        },
        isNoteOnly: false,
        note: null
      },
      {
        text:
          'One trend is a stated contempt among many scholars for the concepts of truth, logic, and evidence. Another is a hypocritical divide between what intellectuals say in public and what they really believe. A third is the inevitable reaction: a culture of “politically incorrect” shock jocks who revel in anti-intellectualism and bigotry, emboldened by the knowledge that the intellectual establishment has forfeited claims to credibility in the eyes of the public.',
        location: {
          url: 'kindle://book?action=open&asin=B000QCTNIM&location=202',
          value: 202
        },
        isNoteOnly: false,
        note: null
      },
      {
        text:
          'ultimately people crave sex in order to reproduce (because the ultimate cause of sex is reproduction), but proximately they may do everything they can not to reproduce (because the proximate cause of sex is pleasure).',
        location: {
          url: 'kindle://book?action=open&asin=B000QCTNIM&location=1423',
          value: 1423
        },
        isNoteOnly: false,
        note: null
      },
      // Notes only
      {
        text: '',
        location: {
          url: 'kindle://book?action=open&asin=B000QCTNIM&location=1543',
          value: 1543
        },
        isNoteOnly: true,
        note: 'RFT adds methodological and conceptual precision to this idea'
      }
    ]
  }
};
