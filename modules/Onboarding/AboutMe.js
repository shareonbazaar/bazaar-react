import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { FormControl, Button } from 'react-bootstrap';

export default function AboutMe(props) {
  const { onContinue, aboutMeText, aboutMeChange } = props;
  return (
    <div>
      <h3>
        <FormattedMessage
          id={'Onboarding.aboutme'}
          defaultMessage={'About me'}
        />
      </h3>
      <h4>
        <FormattedMessage
          id={'Onboarding.tellus'}
          defaultMessage={`Tell us about who you are, where you are
             from and what you would like to get out of share on bazaar.`}
        />
        <span>
          <FormattedMessage
            id={'Onboarding.seen'}
            defaultMessage={' This will be seen by other members.'}
          />
        </span>
      </h4>
      <FormControl
        componentClass="textarea"
        value={aboutMeText}
        placeholder="Please add at least 60 characters"
        onChange={e => aboutMeChange(e.target.value)}
      />

      <Button onClick={onContinue} block bsSize="large">
        <FormattedMessage
          id={'Onboarding.communityLink'}
          defaultMessage={'Continue to the community page'}
        />
      </Button>
    </div>
  );
}
