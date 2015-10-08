/**
 * Generate an array of array of string of numbers
 * @param {number} from - First number to generate
 * @param {number} to - Last number to generate
 * @param {number} rows - Number of rows to generate
 * @param {number} cols - Number of columns to generate
 */
exports.generateArrayOfArrayOfNumbers = function (from, to, rows, cols) {
    var arr = [];
    var i = from;
    for (var row = 0; row < rows; row++) {
        var arr2 = [];
        arr.push(arr2);
        for (var col = 0; col < cols; col++) {
            arr2.push('' + i);
            if (i == to) return arr;
            i++;
        }
    }
};