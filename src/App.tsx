
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  App as F7App,
  View,
  Page,
  Navbar,
  Block,
  List,
  ListItem,
  Radio,
  Checkbox,
  f7,
} from "framework7-react";
import Framework7 from 'framework7/lite-bundle';

import {
  Subject,
  Verb,
  Object,
  Tense,
  Aspect,
  SentenceBuilder,
} from "./English";

// Initialize Framework7
Framework7.use();

export default function App() {
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

  const [sentence, setSentence] = useState<string>("");

  // Framework7 parameters
  const f7params = {
    name: 'English Sentence Builder',
    theme: 'auto',
  };

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
    <F7App {...f7params}>
      <View main>
        <Page>
          <Block>
            <List>
              <ListItem header="Tense">
                <Radio
                  name="tense"
                  value="present"
                  checked={tenseState === Tense.PRESENT}
                  onChange={() => setTenseState(Tense.PRESENT)}
                >
                  Present
                </Radio>
                <Radio
                  name="tense"
                  value="past"
                  checked={tenseState === Tense.PAST}
                  onChange={() => setTenseState(Tense.PAST)}
                >
                  Past
                </Radio>
                <Radio
                  name="tense"
                  value="future"
                  checked={tenseState === Tense.FUTURE}
                  onChange={() => setTenseState(Tense.FUTURE)}
                >
                  Future
                </Radio>
              </ListItem>
              
              <ListItem header="Aspect">
                <Radio
                  name="aspect"
                  value="simple"
                  checked={aspectState === Aspect.SIMPLE}
                  onChange={() => setAspectState(Aspect.SIMPLE)}
                >
                  Simple
                </Radio>
                <Radio
                  name="aspect"
                  value="continuous"
                  checked={aspectState === Aspect.CONTINUOUS}
                  onChange={() => setAspectState(Aspect.CONTINUOUS)}
                >
                  Continuous
                </Radio>
                <Radio
                  name="aspect"
                  value="perfect"
                  checked={aspectState === Aspect.PERFECT}
                  onChange={() => setAspectState(Aspect.PERFECT)}
                >
                  Perfect
                </Radio>
                <Radio
                  name="aspect"
                  value="perfect-continuous"
                  checked={aspectState === Aspect.PERFECT_CONTINUOUS}
                  onChange={() => setAspectState(Aspect.PERFECT_CONTINUOUS)}
                >
                  Perfect Continuous
                </Radio>
              </ListItem>
              
              <ListItem>
                <Checkbox
                  checked={negationState}
                  onChange={() => setNegationState(!negationState)}
                >
                  Negation
                </Checkbox>
              </ListItem>
              
              <ListItem>
                <Checkbox
                  checked={questionState}
                  onChange={() => setQuestionState(!questionState)}
                >
                  Question
                </Checkbox>
              </ListItem>
            </List>
          </Block>
          
          <Block strongText className="result-block">
            <h2>Generated Sentence:</h2>
            <p>{sentence}</p>
          </Block>
        </Page>
      </View>
    </F7App>
  );
}
