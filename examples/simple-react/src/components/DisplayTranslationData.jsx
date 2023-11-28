import { useTranslation } from 'react-i18next';
import translations from '../translations';
import languages from '../language_names';

const getDataKeys = () => {
  let retVal = new Set();

  for (let i = 0; i < translations.length; i += 1) {
    // We only use the translation table here to get the keys.
    // We fetch the translation values from Firestore.
    // In a normal app, you don't loop over the translations values.
    let { ns, data } = translations[i];

    Object.entries(data).forEach(([key]) => {
      retVal.add(`${ns}:${key}`);
    });
  }

  return Array.from(retVal).sort();
};

const DisplayTranslationData = (props) => {
  let selectedTranslation = props.selectedTranslation;
  let listOfNamespaces = props.listOfNamespaces;

  let rowKeys = getDataKeys();
  const { t } = useTranslation(listOfNamespaces);

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>Key</th>
          <th>Translation({languages[selectedTranslation]['en']})</th>
        </tr>
      </thead>
      <tbody>
        {rowKeys.map((key) => {
          let value = t(`${key}`);
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DisplayTranslationData;
