import "./App.css";
import { useState, useEffect } from "react";
import {
  App,
  View,
  Page,
  Navbar,
  Toolbar,
  Link,
  Radio,
  Checkbox,
} from "framework7-react";

import {
  Subject,
  Verb,
  Object,
  Tense,
  Aspect,
  SentenceBuilder,
} from "./English";

export default () => {
  const [subjectState, setSubjectState] = useState<Subject>(
    new Subject("I", "ɪ", true, true, true),
  );
  const [verbState, setVerbState] = useState<Verb>(
    new Verb("eat", "ate", "eaten"),
  );
  const [objectState, setObjectState] = useState<Object>(
    new Object("bowl", "bɔl", false, false, false),
  );

  const [tenseState, setTenseState] = useState<Tense>(Tense.PRESENT);
  const [aspectState, setAspectState] = useState<Aspect>(Aspect.SIMPLE);
  const [negationState, setNegationState] = useState<boolean>(false);
  const [questionState, setQuestionState] = useState<boolean>(false);

  const [sentence, setSentence] = useState<string>();

  useEffect(() => {
    setSentence(
      new SentenceBuilder(subjectState, verbState)
        .setObject(objectState)
        .setTense(tenseState)
        .setAspect(aspectState)
        .setIsNegation(negationState)
        .setIsQuestion(questionState)
        .build(),
    );
  }, [
    subjectState,
    verbState,
    objectState,
    tenseState,
    aspectState,
    negationState,
    questionState,
  ]);

  return (
    // Main Framework7 App component where we pass Framework7 params
    <App theme="auto" name="My App">

      {/* Your main view, should have "main" prop */}
      <View main>
        {/*  Initial Page */}
        <Page>
          <Radio
            name="tense"
            value={tenseState}
            checked={tenseState === Tense.PRESENT}
            onChange={(e) => setTenseState(e.value)}
          >
            Present
          </Radio>
          <Radio
            name="tense"
            value={tenseState}
            checked={tenseState === Tense.PAST}
            onChange={(e) => setTenseState(e.value)}
          >
            Past
          </Radio>
          <Radio
            name="tense"
            value={tenseState}
            checked={tenseState === Tense.FUTURE}
            onChange={(e) => setTenseState(e.value)}
          >
            Future
          </Radio>
          <Radio
            name="aspect"
            value={aspectState}
            checked={aspectState === Aspect.SIMPLE}
            onChange={(e) => setAspectState(e.value)}
          >
            Simple
          </Radio>
          <Radio
            name="aspect"
            value={Aspect.CONTINUOUS}
            checked={aspectState === Aspect.CONTINUOUS}
            onChange={(e) => setAspectState(e.value)}
          >
            Continuous
          </Radio>
          <Radio
            name="aspect"
            value={Aspect.PERFECT}
            checked={aspectState === Aspect.PERFECT}
            onChange={(e) => setAspectState(e.value)}
          >
            Perfect
          </Radio>
          <Radio
            name="aspect"
            value={Aspect.PERFECT_CONTINUOUS}
            checked={aspectState === Aspect.PERFECT_CONTINUOUS}
            onChange={(e) => setAspectState(e.value)}
          >
            Perfect Continuous
          </Radio>
          <Checkbox
            checked={negationState}
            onChange={(e) => setNegationState(e.target.checked)}
          >
            Negation
          </Checkbox>
          <Checkbox
            checked={questionState}
            onChange={(e) => setQuestionState(e.target.checked)}
          >
            Question
          </Checkbox>
          <p>{sentence}</p>
        </Page>
      </View>
    </App>
  );
};
