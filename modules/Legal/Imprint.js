import React from 'react';

const textStyle = {
  textAlign: 'center',
};
const textStyleHead = {
  fontSize: 15,
  fontWeight: 'bold',
};
const Imprint = () => (
  <div className="content-page">
    <div className="imprint">
      <h1 style={textStyle}>Impressum</h1>
      <h2 style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
          Angaben gemaess §5 TMG:
      </h2>
      <p style={{ textAlign: 'center', fontSize: 13 }}>
        Nina Martin<br />
        Exerzierstr. 14 <br />
        c/o be&apos;kech Coworking Space <br />
        13357 Berlin <br />
      </p>
      <h2 style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
          Kontakt:
      </h2>
      <p style={{ textAlign: 'center', fontSize: 13 }}>
        Telefon: 015228745782 <br />
        E-Mail: team@shareonbazaar.eu <br />
      </p>
      <h2 style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
          Haftung für Inhalte
      </h2>
      <p style={{ textAlign: 'center', fontSize: 13 }}>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        <br /><br />
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>
      <h2 style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
          Haftung für Links
      </h2>
      <p style={{ textAlign: 'center', fontSize: 13 }}>
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        <br /><br />
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>
      <h2 style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
          Urheberrecht
      </h2>
      <p style={{ textAlign: 'center', fontSize: 13 }}>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        <br /><br />
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
      </p>
    </div>
  </div>
);

export default Imprint;
