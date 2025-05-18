
// Table layout configuration for PDF exports

/**
 * Creates standard table layout settings for PDF reports
 * @param colors - Color palette to use for the table
 */
export const createTableLayout = (colors: any) => {
  return {
    hLineWidth: function(i: number, node: any) {
      return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
    },
    vLineWidth: function(i: number, node: any) {
      return 0;
    },
    hLineColor: function(i: number, node: any) {
      return colors.border;
    },
    vLineColor: function(i: number, node: any) {
      return colors.border;
    },
    paddingLeft: function(i: number, node: any) { return 8; },
    paddingRight: function(i: number, node: any) { return 8; },
    paddingTop: function(i: number, node: any) { return 6; },
    paddingBottom: function(i: number, node: any) { return 6; },
    fillColor: function(rowIndex: number, node: any, columnIndex: any) {
      return rowIndex % 2 === 0 ? '#FFFFFF' : colors.headerBg;
    }
  };
};
