import { COUNTRIES, phonePH } from './contactData';
import { useLanguage } from '../../context/LanguageContext';

/* Controlled country-code + phone input. Country change updates shared state
   (so both the chat and classic instances stay in sync via the parent) and
   the placeholder reflects the selected country's expected length. */
export default function PhoneField({ country, phone, onCountry, onPhone, onBlur, error, name = 'phone', id }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="phone-row" style={{ display: 'flex', gap: '8px' }}>
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className="cInput phone-country-select"
          aria-label={t('Country dial code')}
          style={{ width: '172px', flexShrink: 0, padding: '13px 10px' }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>{c.dial} {t(c.name)}</option>
          ))}
        </select>
        <input
          id={id}
          name={name}
          type="tel"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          onBlur={onBlur}
          className={`cInput${error ? ' cErr' : ''}`}
          placeholder={phonePH(country)}
        />
      </div>
      {error && <div className="cErrMsg">⚠ {error}</div>}
    </>
  );
}
