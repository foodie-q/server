module.exports = (number) => {
  return 'Rp' + Number
    .parseFloat(+number ? +number : 0)
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
};
