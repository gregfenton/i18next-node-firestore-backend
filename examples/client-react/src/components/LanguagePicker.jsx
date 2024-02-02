import React from 'react';

const LanguagePicker = (props) => {
  let availableTranslations = props.availableTranslations;
  let setSelectedTranslation = props.setSelectedTranslation;

  return (
    <div>
      <label htmlFor='language'>Language:</label>

      <select name='language' id='lang' onChange={(e) => {setSelectedTranslation(e.target.value)}}>
        {availableTranslations.map((transName) => {
          return <option key={transName} value={transName}>{transName}</option>
        })}
      </select>
    </div>
  );
};

export default LanguagePicker;
