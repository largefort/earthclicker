function formatNumber(num) {
    const shortNotation = document.getElementById('toggle-short-notation').textContent === 'Short Numbers: On';
    if (!shortNotation || num < 1000) return num.toFixed(0);
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg'];
    const order = Math.floor(Math.log10(num) / 3);
    return (num / Math.pow(10, order * 3)).toFixed(1) + suffixes[order];
  }
