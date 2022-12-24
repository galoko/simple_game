
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals$9(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

var common = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EPSILON: EPSILON,
  get ARRAY_TYPE () { return ARRAY_TYPE; },
  RANDOM: RANDOM,
  setMatrixArrayType: setMatrixArrayType,
  toRadian: toRadian,
  equals: equals$9
});

/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */

function create$8() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */

function clone$8(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function copy$8(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */

function identity$5(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */

function fromValues$8(m00, m01, m10, m11) {
  var out = new ARRAY_TYPE(4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */

function set$8(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function transpose$2(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    var a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}
/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function invert$5(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3]; // Calculate the determinant

  var det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] = a0 * det;
  return out;
}
/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function adjoint$2(out, a) {
  // Caching this value is nessecary if out == a
  var a0 = a[0];
  out[0] = a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a0;
  return out;
}
/**
 * Calculates the determinant of a mat2
 *
 * @param {ReadonlyMat2} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$3(a) {
  return a[0] * a[3] - a[2] * a[1];
}
/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function multiply$8(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}
/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function rotate$5(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}
/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/

function scale$8(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function fromRotation$4(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2} out
 */

function fromScaling$3(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2
 *
 * @param {ReadonlyMat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$8(a) {
  return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns Frobenius norm of a mat2
 *
 * @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$3(a) {
  return Math.hypot(a[0], a[1], a[2], a[3]);
}
/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {ReadonlyMat2} L the lower triangular matrix
 * @param {ReadonlyMat2} D the diagonal matrix
 * @param {ReadonlyMat2} U the upper triangular matrix
 * @param {ReadonlyMat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2] / a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}
/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function add$8(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function subtract$6(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$8(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$8(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */

function multiplyScalar$3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */

function multiplyScalarAndAdd$3(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Alias for {@link mat2.multiply}
 * @function
 */

var mul$8 = multiply$8;
/**
 * Alias for {@link mat2.subtract}
 * @function
 */

var sub$6 = subtract$6;

var mat2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$8,
  clone: clone$8,
  copy: copy$8,
  identity: identity$5,
  fromValues: fromValues$8,
  set: set$8,
  transpose: transpose$2,
  invert: invert$5,
  adjoint: adjoint$2,
  determinant: determinant$3,
  multiply: multiply$8,
  rotate: rotate$5,
  scale: scale$8,
  fromRotation: fromRotation$4,
  fromScaling: fromScaling$3,
  str: str$8,
  frob: frob$3,
  LDU: LDU,
  add: add$8,
  subtract: subtract$6,
  exactEquals: exactEquals$8,
  equals: equals$8,
  multiplyScalar: multiplyScalar$3,
  multiplyScalarAndAdd: multiplyScalarAndAdd$3,
  mul: mul$8,
  sub: sub$6
});

/**
 * 2x3 Matrix
 * @module mat2d
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */

function create$7() {
  var out = new ARRAY_TYPE(6);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */

function clone$7(a) {
  var out = new ARRAY_TYPE(6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function copy$7(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */

function identity$4(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */

function fromValues$7(a, b, c, d, tx, ty) {
  var out = new ARRAY_TYPE(6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */

function set$7(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function invert$4(out, a) {
  var aa = a[0],
      ab = a[1],
      ac = a[2],
      ad = a[3];
  var atx = a[4],
      aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Calculates the determinant of a mat2d
 *
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$2(a) {
  return a[0] * a[3] - a[1] * a[2];
}
/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function multiply$7(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}
/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function rotate$4(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/

function scale$7(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/

function translate$3(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function fromRotation$3(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2d} out
 */

function fromScaling$2(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat2d} out
 */

function fromTranslation$3(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2d
 *
 * @param {ReadonlyMat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$7(a) {
  return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
}
/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$2(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1);
}
/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function add$7(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function subtract$5(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */

function multiplyScalar$2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}
/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */

function multiplyScalarAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$7(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$7(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
}
/**
 * Alias for {@link mat2d.multiply}
 * @function
 */

var mul$7 = multiply$7;
/**
 * Alias for {@link mat2d.subtract}
 * @function
 */

var sub$5 = subtract$5;

var mat2d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$7,
  clone: clone$7,
  copy: copy$7,
  identity: identity$4,
  fromValues: fromValues$7,
  set: set$7,
  invert: invert$4,
  determinant: determinant$2,
  multiply: multiply$7,
  rotate: rotate$4,
  scale: scale$7,
  translate: translate$3,
  fromRotation: fromRotation$3,
  fromScaling: fromScaling$2,
  fromTranslation: fromTranslation$3,
  str: str$7,
  frob: frob$2,
  add: add$7,
  subtract: subtract$5,
  multiplyScalar: multiplyScalar$2,
  multiplyScalarAndAdd: multiplyScalarAndAdd$2,
  exactEquals: exactEquals$7,
  equals: equals$7,
  mul: mul$7,
  sub: sub$5
});

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$6() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {ReadonlyMat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */

function clone$6(a) {
  var out = new ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function copy$6(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues$6(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */

function set$6(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity$3(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose$1(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert$3(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function adjoint$1(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$1(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply$6(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate$2(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate$3(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale$6(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation$2(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function fromRotation$2(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = -s;
  out[4] = c;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling$1(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to copy
 * @returns {mat3} out
 **/

function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat$1(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */

function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Returns a string representation of a mat3
 *
 * @param {ReadonlyMat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$6(a) {
  return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
}
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$1(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function add$6(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function subtract$4(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */

function multiplyScalar$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */

function multiplyScalarAndAdd$1(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$6(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$6(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7],
      a8 = a[8];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul$6 = multiply$6;
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub$4 = subtract$4;

var mat3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$6,
  fromMat4: fromMat4$1,
  clone: clone$6,
  copy: copy$6,
  fromValues: fromValues$6,
  set: set$6,
  identity: identity$3,
  transpose: transpose$1,
  invert: invert$3,
  adjoint: adjoint$1,
  determinant: determinant$1,
  multiply: multiply$6,
  translate: translate$2,
  rotate: rotate$3,
  scale: scale$6,
  fromTranslation: fromTranslation$2,
  fromRotation: fromRotation$2,
  fromScaling: fromScaling$1,
  fromMat2d: fromMat2d,
  fromQuat: fromQuat$1,
  normalFromMat4: normalFromMat4,
  projection: projection,
  str: str$6,
  frob: frob$1,
  add: add$6,
  subtract: subtract$4,
  multiplyScalar: multiplyScalar$1,
  multiplyScalarAndAdd: multiplyScalarAndAdd$1,
  exactEquals: exactEquals$6,
  equals: equals$6,
  mul: mul$6,
  sub: sub$4
});

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$5() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone$5(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues$5(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set$5(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity$2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert$2(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply$5(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$5(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate$2(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation$1(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation$1(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation$1(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation$1(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation$1(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity$2(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$5(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add$5(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract$3(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$5(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$5(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul$5 = multiply$5;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub$3 = subtract$3;

var mat4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$5,
  clone: clone$5,
  copy: copy$5,
  fromValues: fromValues$5,
  set: set$5,
  identity: identity$2,
  transpose: transpose,
  invert: invert$2,
  adjoint: adjoint,
  determinant: determinant,
  multiply: multiply$5,
  translate: translate$1,
  scale: scale$5,
  rotate: rotate$2,
  rotateX: rotateX$3,
  rotateY: rotateY$3,
  rotateZ: rotateZ$3,
  fromTranslation: fromTranslation$1,
  fromScaling: fromScaling,
  fromRotation: fromRotation$1,
  fromXRotation: fromXRotation,
  fromYRotation: fromYRotation,
  fromZRotation: fromZRotation,
  fromRotationTranslation: fromRotationTranslation$1,
  fromQuat2: fromQuat2,
  getTranslation: getTranslation$1,
  getScaling: getScaling,
  getRotation: getRotation,
  fromRotationTranslationScale: fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
  fromQuat: fromQuat,
  frustum: frustum,
  perspectiveNO: perspectiveNO,
  perspective: perspective,
  perspectiveZO: perspectiveZO,
  perspectiveFromFieldOfView: perspectiveFromFieldOfView,
  orthoNO: orthoNO,
  ortho: ortho,
  orthoZO: orthoZO,
  lookAt: lookAt,
  targetTo: targetTo,
  str: str$5,
  frob: frob,
  add: add$5,
  subtract: subtract$3,
  multiplyScalar: multiplyScalar,
  multiplyScalarAndAdd: multiplyScalarAndAdd,
  exactEquals: exactEquals$5,
  equals: equals$5,
  mul: mul$5,
  sub: sub$3
});

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$4() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone$4(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$4(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set$4(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add$4(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract$2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide$2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil$2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor$2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min$2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max$2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round$2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale$4(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse$2(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$4(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$5(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross$3(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp$5(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random$3(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  var z = RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4$2(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3$1(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat$1(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle$1(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot$5(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero$2(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$4(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$4(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals$4(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub$2 = subtract$2;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul$4 = multiply$4;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div$2 = divide$2;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist$2 = distance$2;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist$2 = squaredDistance$2;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len$4 = length$4;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen$4 = squaredLength$4;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$2 = function () {
  var vec = create$4();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

var vec3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$4,
  clone: clone$4,
  length: length$4,
  fromValues: fromValues$4,
  copy: copy$4,
  set: set$4,
  add: add$4,
  subtract: subtract$2,
  multiply: multiply$4,
  divide: divide$2,
  ceil: ceil$2,
  floor: floor$2,
  min: min$2,
  max: max$2,
  round: round$2,
  scale: scale$4,
  scaleAndAdd: scaleAndAdd$2,
  distance: distance$2,
  squaredDistance: squaredDistance$2,
  squaredLength: squaredLength$4,
  negate: negate$2,
  inverse: inverse$2,
  normalize: normalize$4,
  dot: dot$5,
  cross: cross$3,
  lerp: lerp$5,
  hermite: hermite,
  bezier: bezier,
  random: random$3,
  transformMat4: transformMat4$2,
  transformMat3: transformMat3$1,
  transformQuat: transformQuat$1,
  rotateX: rotateX$2,
  rotateY: rotateY$2,
  rotateZ: rotateZ$2,
  angle: angle$1,
  zero: zero$2,
  str: str$4,
  exactEquals: exactEquals$4,
  equals: equals$4,
  sub: sub$2,
  mul: mul$4,
  div: div$2,
  dist: dist$2,
  sqrDist: sqrDist$2,
  len: len$4,
  sqrLen: sqrLen$4,
  forEach: forEach$2
});

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone$3(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues$3(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function copy$3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set$3(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function add$3(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function multiply$3(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function divide$1(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */

function ceil$1(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */

function floor$1(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function min$1(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function max$1(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */

function round$1(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale$3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function scaleAndAdd$1(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */

function distance$1(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance$1(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$3(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$3(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */

function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */

function inverse$1(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$3(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$4(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} result the receiving vector
 * @param {ReadonlyVec4} U the first vector
 * @param {ReadonlyVec4} V the second vector
 * @param {ReadonlyVec4} W the third vector
 * @returns {vec4} result
 */

function cross$2(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp$4(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function random$2(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = RANDOM() * 2 - 1;
    v2 = RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = RANDOM() * 2 - 1;
    v4 = RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4$1(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function zero$1(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$3(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$3(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals$3(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var sub$1 = subtract$1;
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var mul$3 = multiply$3;
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var div$1 = divide$1;
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var dist$1 = distance$1;
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var sqrDist$1 = squaredDistance$1;
/**
 * Alias for {@link vec4.length}
 * @function
 */

var len$3 = length$3;
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var sqrLen$3 = squaredLength$3;
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$1 = function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

var vec4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$3,
  clone: clone$3,
  fromValues: fromValues$3,
  copy: copy$3,
  set: set$3,
  add: add$3,
  subtract: subtract$1,
  multiply: multiply$3,
  divide: divide$1,
  ceil: ceil$1,
  floor: floor$1,
  min: min$1,
  max: max$1,
  round: round$1,
  scale: scale$3,
  scaleAndAdd: scaleAndAdd$1,
  distance: distance$1,
  squaredDistance: squaredDistance$1,
  length: length$3,
  squaredLength: squaredLength$3,
  negate: negate$1,
  inverse: inverse$1,
  normalize: normalize$3,
  dot: dot$4,
  cross: cross$2,
  lerp: lerp$4,
  random: random$2,
  transformMat4: transformMat4$1,
  transformQuat: transformQuat,
  zero: zero$1,
  str: str$3,
  exactEquals: exactEquals$3,
  equals: equals$3,
  sub: sub$1,
  mul: mul$3,
  div: div$1,
  dist: dist$1,
  sqrDist: sqrDist$1,
  len: len$3,
  sqrLen: sqrLen$3,
  forEach: forEach$1
});

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$2() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity$1(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {ReadonlyQuat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */

function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);

  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }

  return rad;
}
/**
 * Gets the angular distance between two unit quaternions
 *
 * @param  {ReadonlyQuat} a     Origin unit quaternion
 * @param  {ReadonlyQuat} b     Destination unit quaternion
 * @return {Number}     Angle, in radians, between the two quaternions
 */

function getAngle(a, b) {
  var dotproduct = dot$3(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */

function multiply$2(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX$1(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY$1(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ$1(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Calculate the exponential of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function exp(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
/**
 * Calculate the natural logarithm of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function ln(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
/**
 * Calculate the scalar power of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @param {Number} b amount to scale the quaternion by
 * @returns {quat} out
 */

function pow(out, a, b) {
  ln(out, a);
  scale$2(out, out, b);
  exp(out, out);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Generates a random unit quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function random$1(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  var u1 = RANDOM();
  var u2 = RANDOM();
  var u3 = RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert$1(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
/**
 * Returns a string representation of a quatenion
 *
 * @param {ReadonlyQuat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$2(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */

var clone$2 = clone$3;
/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */

var fromValues$2 = fromValues$3;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy$2 = copy$3;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set$2 = set$3;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add$2 = add$3;
/**
 * Alias for {@link quat.multiply}
 * @function
 */

var mul$2 = multiply$2;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {ReadonlyQuat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale$2 = scale$3;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot$3 = dot$4;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp$3 = lerp$4;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length$2 = length$3;
/**
 * Alias for {@link quat.length}
 * @function
 */

var len$2 = length$2;
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength$2 = squaredLength$3;
/**
 * Alias for {@link quat.squaredLength}
 * @function
 */

var sqrLen$2 = squaredLength$2;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$2 = normalize$3;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat} a The first quaternion.
 * @param {ReadonlyQuat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals$2 = exactEquals$3;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat} a The first vector.
 * @param {ReadonlyQuat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals$2 = equals$3;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = create$4();
  var xUnitVec3 = fromValues$4(1, 0, 0);
  var yUnitVec3 = fromValues$4(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$5(a, b);

    if (dot < -0.999999) {
      cross$3(tmpvec3, xUnitVec3, a);
      if (len$4(tmpvec3) < 0.000001) cross$3(tmpvec3, yUnitVec3, a);
      normalize$4(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross$3(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$2(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = function () {
  var temp1 = create$2();
  var temp2 = create$2();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = function () {
  var matr = create$6();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
}();

var quat = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$2,
  identity: identity$1,
  setAxisAngle: setAxisAngle,
  getAxisAngle: getAxisAngle,
  getAngle: getAngle,
  multiply: multiply$2,
  rotateX: rotateX$1,
  rotateY: rotateY$1,
  rotateZ: rotateZ$1,
  calculateW: calculateW,
  exp: exp,
  ln: ln,
  pow: pow,
  slerp: slerp,
  random: random$1,
  invert: invert$1,
  conjugate: conjugate$1,
  fromMat3: fromMat3,
  fromEuler: fromEuler,
  str: str$2,
  clone: clone$2,
  fromValues: fromValues$2,
  copy: copy$2,
  set: set$2,
  add: add$2,
  mul: mul$2,
  scale: scale$2,
  dot: dot$3,
  lerp: lerp$3,
  length: length$2,
  len: len$2,
  squaredLength: squaredLength$2,
  sqrLen: sqrLen$2,
  normalize: normalize$2,
  exactEquals: exactEquals$2,
  equals: equals$2,
  rotationTo: rotationTo,
  sqlerp: sqlerp,
  setAxes: setAxes
});

/**
 * Dual Quaternion<br>
 * Format: [real, dual]<br>
 * Quaternion format: XYZW<br>
 * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
 * @module quat2
 */

/**
 * Creates a new identity dual quat
 *
 * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
 */

function create$1() {
  var dq = new ARRAY_TYPE(8);

  if (ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }

  dq[3] = 1;
  return dq;
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat2} a dual quaternion to clone
 * @returns {quat2} new dual quaternion
 * @function
 */

function clone$1(a) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
/**
 * Creates a new dual quat initialized with the given values
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromValues$1(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
/**
 * Creates a new dual quat from the given values (quat and translation)
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component (translation)
 * @param {Number} y2 Y component (translation)
 * @param {Number} z2 Z component (translation)
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5,
      ay = y2 * 0.5,
      az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
/**
 * Creates a dual quat from a quaternion and a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q a normalized quaternion
 * @param {ReadonlyVec3} t tranlation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotationTranslation(out, q, t) {
  var ax = t[0] * 0.5,
      ay = t[1] * 0.5,
      az = t[2] * 0.5,
      bx = q[0],
      by = q[1],
      bz = q[2],
      bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Creates a dual quat from a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyVec3} t translation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromTranslation(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
/**
 * Creates a dual quat from a quaternion
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q the quaternion
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotation(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Creates a new dual quat from a matrix (4x4)
 *
 * @param {quat2} out the dual quaternion
 * @param {ReadonlyMat4} a the matrix
 * @returns {quat2} dual quat receiving operation result
 * @function
 */

function fromMat4(out, a) {
  //TODO Optimize this
  var outer = create$2();
  getRotation(outer, a);
  var t = new ARRAY_TYPE(3);
  getTranslation$1(t, a);
  fromRotationTranslation(out, outer, t);
  return out;
}
/**
 * Copy the values from one dual quat to another
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the source dual quaternion
 * @returns {quat2} out
 * @function
 */

function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  return out;
}
/**
 * Set a dual quat to the identity dual quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @returns {quat2} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Set the components of a dual quat to the given values
 *
 * @param {quat2} out the receiving quaternion
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} out
 * @function
 */

function set$1(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
/**
 * Gets the real part of a dual quat
 * @param  {quat} out real part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} real part
 */

var getReal = copy$2;
/**
 * Gets the dual part of a dual quat
 * @param  {quat} out dual part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} dual part
 */

function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
/**
 * Set the real component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the real part
 * @returns {quat2} out
 * @function
 */

var setReal = copy$2;
/**
 * Set the dual component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the dual part
 * @returns {quat2} out
 * @function
 */

function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
/**
 * Gets the translation of a normalized dual quat
 * @param  {vec3} out translation
 * @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
 * @return {vec3} translation
 */

function getTranslation(out, a) {
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
/**
 * Translates a dual quat by the given vector
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {quat2} out
 */

function translate(out, a, v) {
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3],
      bx1 = v[0] * 0.5,
      by1 = v[1] * 0.5,
      bz1 = v[2] * 0.5,
      ax2 = a[4],
      ay2 = a[5],
      az2 = a[6],
      aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
/**
 * Rotates a dual quat around the X axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateX(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateX$1(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Y axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateY(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateY$1(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Z axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateZ(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateZ$1(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (a * q)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @returns {quat2} out
 */

function rotateByQuatAppend(out, a, q) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (q * a)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @returns {quat2} out
 */

function rotateByQuatPrepend(out, q, a) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      bx = a[0],
      by = a[1],
      bz = a[2],
      bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
/**
 * Rotates a dual quat around a given axis. Does the normalisation automatically
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @param {Number} rad how far the rotation should be
 * @returns {quat2} out
 */

function rotateAroundAxis(out, a, axis, rad) {
  //Special case for rad = 0
  if (Math.abs(rad) < EPSILON) {
    return copy$1(out, a);
  }

  var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = s * axis[0] / axisLength;
  var by = s * axis[1] / axisLength;
  var bz = s * axis[2] / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Adds two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 * @function
 */

function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  return out;
}
/**
 * Multiplies two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 */

function multiply$1(out, a, b) {
  var ax0 = a[0],
      ay0 = a[1],
      az0 = a[2],
      aw0 = a[3],
      bx1 = b[4],
      by1 = b[5],
      bz1 = b[6],
      bw1 = b[7],
      ax1 = a[4],
      ay1 = a[5],
      az1 = a[6],
      aw1 = a[7],
      bx0 = b[0],
      by0 = b[1],
      bz0 = b[2],
      bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
/**
 * Alias for {@link quat2.multiply}
 * @function
 */

var mul$1 = multiply$1;
/**
 * Scales a dual quat by a scalar number
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the dual quat to scale
 * @param {Number} b amount to scale the dual quat by
 * @returns {quat2} out
 * @function
 */

function scale$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
/**
 * Calculates the dot product of two dual quat's (The dot product of the real parts)
 *
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot$2 = dot$3;
/**
 * Performs a linear interpolation between two dual quats's
 * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat2} out
 */

function lerp$2(out, a, b, t) {
  var mt = 1 - t;
  if (dot$2(a, b) < 0) t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
/**
 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quat to calculate inverse of
 * @returns {quat2} out
 */

function invert(out, a) {
  var sqlen = squaredLength$1(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
/**
 * Calculates the conjugate of a dual quat
 * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat2} a quat to calculate conjugate of
 * @returns {quat2} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
/**
 * Calculates the length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate length of
 * @returns {Number} length of a
 * @function
 */

var length$1 = length$2;
/**
 * Alias for {@link quat2.length}
 * @function
 */

var len$1 = length$1;
/**
 * Calculates the squared length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength$1 = squaredLength$2;
/**
 * Alias for {@link quat2.squaredLength}
 * @function
 */

var sqrLen$1 = squaredLength$1;
/**
 * Normalize a dual quat
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quaternion to normalize
 * @returns {quat2} out
 * @function
 */

function normalize$1(out, a) {
  var magnitude = squaredLength$1(a);

  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }

  return out;
}
/**
 * Returns a string representation of a dual quatenion
 *
 * @param {ReadonlyQuat2} a dual quaternion to represent as a string
 * @returns {String} string representation of the dual quat
 */

function str$1(a) {
  return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
}
/**
 * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat2} a the first dual quaternion.
 * @param {ReadonlyQuat2} b the second dual quaternion.
 * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
 */

function exactEquals$1(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
}
/**
 * Returns whether or not the dual quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat2} a the first dual quat.
 * @param {ReadonlyQuat2} b the second dual quat.
 * @returns {Boolean} true if the dual quats are equal, false otherwise.
 */

function equals$1(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
}

var quat2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$1,
  clone: clone$1,
  fromValues: fromValues$1,
  fromRotationTranslationValues: fromRotationTranslationValues,
  fromRotationTranslation: fromRotationTranslation,
  fromTranslation: fromTranslation,
  fromRotation: fromRotation,
  fromMat4: fromMat4,
  copy: copy$1,
  identity: identity,
  set: set$1,
  getReal: getReal,
  getDual: getDual,
  setReal: setReal,
  setDual: setDual,
  getTranslation: getTranslation,
  translate: translate,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  rotateByQuatAppend: rotateByQuatAppend,
  rotateByQuatPrepend: rotateByQuatPrepend,
  rotateAroundAxis: rotateAroundAxis,
  add: add$1,
  multiply: multiply$1,
  mul: mul$1,
  scale: scale$1,
  dot: dot$2,
  lerp: lerp$2,
  invert: invert,
  conjugate: conjugate,
  length: length$1,
  len: len$1,
  squaredLength: squaredLength$1,
  sqrLen: sqrLen$1,
  normalize: normalize$1,
  str: str$1,
  exactEquals: exactEquals$1,
  equals: equals$1
});

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to floor
 * @returns {vec2} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to round
 * @returns {vec2} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to negate
 * @returns {vec2} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to invert
 * @returns {vec2} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec3} out
 */

function cross$1(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp$1(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate$1(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1];
  var b0 = b[0],
      b1 = b[1];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

var vec2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  clone: clone,
  fromValues: fromValues,
  copy: copy,
  set: set,
  add: add,
  subtract: subtract,
  multiply: multiply,
  divide: divide,
  ceil: ceil,
  floor: floor,
  min: min,
  max: max,
  round: round,
  scale: scale,
  scaleAndAdd: scaleAndAdd,
  distance: distance,
  squaredDistance: squaredDistance,
  length: length,
  squaredLength: squaredLength,
  negate: negate,
  inverse: inverse,
  normalize: normalize,
  dot: dot$1,
  cross: cross$1,
  lerp: lerp$1,
  random: random,
  transformMat2: transformMat2,
  transformMat2d: transformMat2d,
  transformMat3: transformMat3,
  transformMat4: transformMat4,
  rotate: rotate$1,
  angle: angle,
  zero: zero,
  str: str,
  exactEquals: exactEquals,
  equals: equals,
  len: len,
  sub: sub,
  mul: mul,
  div: div,
  dist: dist,
  sqrDist: sqrDist,
  sqrLen: sqrLen,
  forEach: forEach
});

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}
function getAngleFromPoint(x, y) {
    return Math.atan2(y, x);
}
function getAngleFromVector(v) {
    const [x, y] = v;
    return Math.atan2(y, x);
}
function getAngleFromMatrix(m) {
    return Math.atan2(m[1], m[3]);
}
function dot(v1, v2) {
    const [x0, y0] = v1;
    const [x1, y1] = v2;
    return x0 * x1 + y0 * y1;
}
function cross(v) {
    return fromValues(v[1], -v[0]);
}
function rotate(v, angle) {
    const [x, y] = v;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return fromValues(x * c - y * s, x * s + y * c);
}

let nowValue = performance.now();
let dtValue = 0;
function now() {
    return nowValue;
}
function setNow(time) {
    dtValue = (time - nowValue) / 1000;
    nowValue = time;
}
function getDT() {
    return dtValue;
}

function getParent(obj) {
    let parent = obj.parent;
    if (parent && obj.graphics.attachPoint) {
        const p = parent.points.get(obj.graphics.attachPoint);
        if (p) {
            parent = p.obj;
        }
    }
    return parent;
}
const IDENTITY = create$7();
function getParentWorldMatrix(obj) {
    const parent = getParent(obj);
    return parent ? parent.getWorldMatrix() : IDENTITY;
}
function getParentWorldZ(obj) {
    const parent = getParent(obj);
    return parent ? parent.worldZ : 0;
}
function getAttachmentInfo(obj, pointName, t) {
    const p = obj.points.get(pointName);
    if (!p) {
        return undefined;
    }
    const { point, obj: parentObj } = p;
    const [x0, y0, x1, y1] = point;
    const angle = getAngleFromPoint(x1 - x0, y1 - y0);
    const offset = fromValues(lerp(x0, x1, t), lerp(y0, y1, t));
    transformMat2d(offset, offset, parentObj.graphics.unitMatrix);
    const m = create$7();
    translate$3(m, m, offset);
    rotate$4(m, m, angle);
    return { m, parentObj };
}
function getWorldPoint(obj) {
    const p = fromValues(0, 0);
    const m = obj.getWorldMatrix();
    transformMat2d(p, p, m);
    return p;
}
function getWorldPivotPoint(obj) {
    const p = fromValues(0, 0);
    const m = obj.getWorldMatrix();
    sub(p, p, obj.graphics.pivot);
    transformMat2d(p, p, m);
    return p;
}
function recalcWorldTransforms(obj) {
    obj.calcWorldMatrix();
    if (obj.graphics) {
        const time = now() - obj.startTime;
        const index = obj.graphics.timeToIndex(time);
        const points = obj.graphics.getPoints(index);
        if (points) {
            if (!obj.parent) {
                throw new Error("Attachment without a parent.");
            }
            for (const pointName in points) {
                obj.parent.setPoint(pointName, points[pointName], obj);
            }
        }
    }
    for (const slot in obj.attachments) {
        recalcWorldTransforms(obj.attachments[slot]);
    }
}

const UP = fromValues(0, -1);
function aimAt(p, objectToRotate, attachmentName) {
    const parent = objectToRotate.parent;
    if (!parent) {
        return;
    }
    recalcWorldTransforms(parent);
    const rotationCenter = getWorldPivotPoint(objectToRotate);
    const attachmentInfo = getAttachmentInfo(parent, attachmentName, 1);
    if (rotationCenter && attachmentInfo) {
        objectToRotate.angle = 0;
        objectToRotate.calcWorldMatrix();
        const { parentObj: attachmentObj, m: attachmentMatrix } = attachmentInfo;
        const attachmentWorldMatrix = create$7();
        mul$7(attachmentWorldMatrix, attachmentWorldMatrix, attachmentObj.calcWorldMatrix());
        mul$7(attachmentWorldMatrix, attachmentWorldMatrix, attachmentMatrix);
        const attachmentAngle = getAngleFromMatrix(attachmentWorldMatrix);
        const attachmentLocalSpace = fromValues(0, 0);
        transformMat2d(attachmentLocalSpace, attachmentLocalSpace, attachmentWorldMatrix);
        sub(attachmentLocalSpace, attachmentLocalSpace, rotationCenter);
        mul(attachmentLocalSpace, attachmentLocalSpace, parent.mirrorVec);
        const offsetHeight = dot(rotate(attachmentLocalSpace, -attachmentAngle), UP) * parent.mirrorMul;
        const offsetUp = create();
        scale(offsetUp, UP, offsetHeight);
        const delta = create();
        add(delta, delta, p);
        sub(delta, delta, rotationCenter);
        const mouseAngle = getAngleFromVector(delta);
        sub(delta, delta, rotate(offsetUp, mouseAngle));
        // normalized delta
        const tangent = create();
        normalize(tangent, delta);
        const normal = cross(tangent);
        const pointOnCircle = create();
        scale(pointOnCircle, normal, offsetHeight);
        const pointOnCircleWorldSpace = create();
        add(pointOnCircleWorldSpace, rotationCenter, pointOnCircle);
        const deltaPointAndPointOnCircle = create();
        sub(deltaPointAndPointOnCircle, p, pointOnCircleWorldSpace);
        mul(deltaPointAndPointOnCircle, deltaPointAndPointOnCircle, parent.mirrorVec);
        objectToRotate.angle = getAngleFromVector(deltaPointAndPointOnCircle) - attachmentAngle;
        objectToRotate.angleIsWorldAngle = true;
        objectToRotate.calcWorldMatrix();
    }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
var GraphicsType;
(function (GraphicsType) {
    GraphicsType["NONE"] = "none";
    GraphicsType["IMG"] = "img";
    GraphicsType["LINE"] = "line";
})(GraphicsType || (GraphicsType = {}));
var PhysicsType;
(function (PhysicsType) {
    PhysicsType["STATIC"] = "static";
    PhysicsType["DYNAMIC"] = "dynamic";
    PhysicsType["KINEMATIC"] = "kinematic";
    PhysicsType["NONE"] = "none";
})(PhysicsType || (PhysicsType = {}));
class Graphics {
    name;
    prefix;
    frames = [];
    unitMatrix = create$7();
    invUnitMatrix = create$7();
    pivot = create();
    width = 1;
    height = 1;
    scale = 1;
    attachPoint = undefined;
    attachT = 0;
    points = [];
    duration = 1000;
    type = GraphicsType.NONE;
    path = undefined;
    color = undefined;
    alpha = 1;
    stroke = true;
    physicsType = PhysicsType.NONE;
    physicsPoints = undefined;
    physicsPivot = undefined;
    fixedRotation = false;
    density = 5;
    friction = 0;
    restitution = 0;
    isSensor = false;
    constructor(name, prefix) {
        this.name = name;
        this.prefix = prefix;
    }
    async load() {
        const dataUrl = this.prefix
            ? `assets/${this.name}/${this.prefix}.json`
            : `assets/${this.name}.json`;
        const response = await fetch(dataUrl);
        const data = response.ok ? await response.json() : {};
        this.type = data.type || GraphicsType.IMG;
        if (this.type === GraphicsType.IMG) {
            const promises = [];
            if (data.frames !== undefined) {
                for (let i = 1; i <= data.frames; i++) {
                    promises.push(loadImage(`assets/${this.name}/${this.prefix}_${i}.png`));
                }
            }
            else {
                promises.push(loadImage(`assets/${this.name}.png`));
            }
            this.frames = await Promise.all(promises);
        }
        else {
            const line = data.line;
            this.path = new Path2D();
            this.path.moveTo(line[0], line[1]);
            this.path.lineTo(line[2], line[3]);
            this.color = data.color;
            this.alpha = data.alpha || this.alpha;
            this.stroke = this.type === GraphicsType.LINE;
        }
        // IN PIXELS
        const firstFrame = this.frames[0];
        const pixelWidth = firstFrame?.width || 1;
        const pixelHeight = firstFrame?.height || 1;
        fromScaling$2(this.unitMatrix, fromValues(1 / pixelWidth, 1 / pixelWidth));
        invert$4(this.invUnitMatrix, this.unitMatrix);
        this.width = pixelWidth / pixelWidth;
        this.height = pixelHeight / pixelWidth;
        // default is [center, bottom]
        const pivot = data.pivot || (firstFrame ? [firstFrame.width / 2, firstFrame.height] : [0, 0]);
        // physics
        this.physicsType = data.physics || this.physicsType;
        if (this.physicsType !== PhysicsType.NONE) {
            const physicsPoints = data.physicsPoints || [
                0,
                0,
                pixelWidth,
                0,
                pixelWidth,
                pixelHeight,
                0,
                pixelHeight,
            ];
            this.physicsPoints = [];
            for (let i = 0; i < physicsPoints.length; i += 2) {
                const p = fromValues(physicsPoints[i + 0], physicsPoints[i + 1]);
                transformMat2d(p, p, this.unitMatrix);
                this.physicsPoints.push(p);
            }
        }
        set(this.pivot, pivot[0], pivot[1]);
        negate(this.pivot, this.pivot);
        transformMat2d(this.pivot, this.pivot, this.unitMatrix);
        // IN UNITS
        this.scale = data.scale || this.scale;
        this.attachPoint = data.attachPoint;
        this.attachT = data.attachT || this.attachT;
        this.points = data.points || this.points;
        this.duration = data.duration || this.duration;
    }
    timeToIndex(time) {
        const index = Math.max(0, Math.min(Math.trunc(((time / this.duration) % 1) * this.frames.length), this.frames.length - 1));
        return index;
    }
    getPoints(index) {
        return this.points[index];
    }
    getFrame(index) {
        return this.frames[index];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPath(_index) {
        return this.path;
    }
}
async function createGraphics(name, prefix) {
    const graphics = new Graphics(name, prefix);
    await graphics.load();
    return graphics;
}
function createDummyGraphics() {
    return new Graphics("dummy");
}

var Box2D$1 = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Box2D) {
  Box2D = Box2D || {};


var a;a||(a=typeof Box2D !== 'undefined' ? Box2D : {});var aa;a.ready=new Promise(function(b){aa=b;});var ba={},ca;for(ca in a)a.hasOwnProperty(ca)&&(ba[ca]=a[ca]);var da=!1,ea=!1,fa=!1,ha=!1;da="object"===typeof window;ea="function"===typeof importScripts;fa="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;ha=!da&&!fa&&!ea;var ia="",ja,ka,la,ma;
if(fa)ia=ea?require("path").dirname(ia)+"/":__dirname+"/",ja=function(b,c){la||(la=require("fs"));ma||(ma=require("path"));b=ma.normalize(b);return la.readFileSync(b,c?null:"utf8")},ka=function(b){b=ja(b,!0);b.buffer||(b=new Uint8Array(b));assert(b.buffer);return b},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(b){throw b;}),process.on("unhandledRejection",na),a.inspect=function(){return "[Emscripten Module object]"};else if(ha)"undefined"!=
typeof read&&(ja=function(b){return read(b)}),ka=function(b){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(b));b=read(b,"binary");assert("object"===typeof b);return b},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(da||ea)ea?ia=self.location.href:document.currentScript&&(ia=document.currentScript.src),_scriptDir&&(ia=_scriptDir),ia=0!==ia.indexOf("blob:")?
ia.substr(0,ia.lastIndexOf("/")+1):"",ja=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},ea&&(ka=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)});var pa=a.print||console.log.bind(console),qa=a.printErr||console.warn.bind(console);for(ca in ba)ba.hasOwnProperty(ca)&&(a[ca]=ba[ca]);ba=null;var ra;a.wasmBinary&&(ra=a.wasmBinary);var noExitRuntime;
a.noExitRuntime&&(noExitRuntime=a.noExitRuntime);"object"!==typeof WebAssembly&&qa("no native wasm support detected");var sa,ta=new WebAssembly.Table({initial:210,maximum:230,element:"anyfunc"}),ua=!1;function assert(b,c){b||na("Assertion failed: "+c);}var va="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function wa(b,c,d){var f=c+d;for(d=c;b[d]&&!(d>=f);)++d;if(16<d-c&&b.subarray&&va)return va.decode(b.subarray(c,d));for(f="";c<d;){var y=b[c++];if(y&128){var oa=b[c++]&63;if(192==(y&224))f+=String.fromCharCode((y&31)<<6|oa);else {var ya=b[c++]&63;y=224==(y&240)?(y&15)<<12|oa<<6|ya:(y&7)<<18|oa<<12|ya<<6|b[c++]&63;65536>y?f+=String.fromCharCode(y):(y-=65536,f+=String.fromCharCode(55296|y>>10,56320|y&1023));}}else f+=String.fromCharCode(y);}return f}function xa(b){return b?wa(za,b,void 0):""}
var Aa,za,Ba,Ca;function Da(b){Aa=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=Ba=new Int32Array(b);a.HEAPU8=za=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=Ca=new Float64Array(b);}var Ea=a.INITIAL_MEMORY||16777216;if(sa=a.wasmMemory?a.wasmMemory:new WebAssembly.Memory({initial:Ea/65536,maximum:32768}))Aa=sa.buffer;Ea=Aa.byteLength;Da(Aa);Ba[6512]=5269088;
function Fa(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else {var d=c.ev;"number"===typeof d?void 0===c.Au?a.dynCall_v(d):a.dynCall_vi(d,c.Au):d(void 0===c.Au?null:c.Au);}}}var Ga=[],Ha=[],Ia=[],Ja=[],Ka=!1;function La(){var b=a.preRun.shift();Ga.unshift(b);}var Ma=0,Na=null,Oa=null;a.preloadedImages={};a.preloadedAudios={};
function na(b){if(a.onAbort)a.onAbort(b);b+="";pa(b);qa(b);ua=!0;throw new WebAssembly.RuntimeError("abort("+b+"). Build with -s ASSERTIONS=1 for more info.");}function Pa(b){var c=Qa;return String.prototype.startsWith?c.startsWith(b):0===c.indexOf(b)}function Ra(){return Pa("data:application/octet-stream;base64,")}var Qa="Box2D_v2.3.1_min.wasm.wasm";if(!Ra()){var Sa=Qa;Qa=a.locateFile?a.locateFile(Sa,ia):ia+Sa;}
function Ta(){try{if(ra)return new Uint8Array(ra);if(ka)return ka(Qa);throw "both async and sync fetching of the wasm failed";}catch(b){na(b);}}function Ua(){return ra||!da&&!ea||"function"!==typeof fetch||Pa("file://")?new Promise(function(b){b(Ta());}):fetch(Qa,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw "failed to load wasm binary file at '"+Qa+"'";return b.arrayBuffer()}).catch(function(){return Ta()})}
var Va={1156:function(b,c){b=a.getCache(a.JSDestructionListener)[b];if(!b.hasOwnProperty("SayGoodbyeJoint"))throw "a JSImplementation must implement all functions, you forgot JSDestructionListener::SayGoodbyeJoint.";b.SayGoodbyeJoint(c);},1414:function(b,c){b=a.getCache(a.JSDestructionListener)[b];if(!b.hasOwnProperty("SayGoodbyeFixture"))throw "a JSImplementation must implement all functions, you forgot JSDestructionListener::SayGoodbyeFixture.";b.SayGoodbyeFixture(c);},1840:function(b,c){b=a.getCache(a.JSQueryCallback)[b];
if(!b.hasOwnProperty("ReportFixture"))throw "a JSImplementation must implement all functions, you forgot JSQueryCallback::ReportFixture.";return b.ReportFixture(c)},2104:function(b,c,d,f,y){b=a.getCache(a.JSRayCastCallback)[b];if(!b.hasOwnProperty("ReportFixture"))throw "a JSImplementation must implement all functions, you forgot JSRayCastCallback::ReportFixture.";return b.ReportFixture(c,d,f,y)},2400:function(b,c){b=a.getCache(a.JSContactListener)[b];if(!b.hasOwnProperty("BeginContact"))throw "a JSImplementation must implement all functions, you forgot JSContactListener::BeginContact.";
b.BeginContact(c);},2638:function(b,c){b=a.getCache(a.JSContactListener)[b];if(!b.hasOwnProperty("EndContact"))throw "a JSImplementation must implement all functions, you forgot JSContactListener::EndContact.";b.EndContact(c);},2870:function(b,c,d){b=a.getCache(a.JSContactListener)[b];if(!b.hasOwnProperty("PreSolve"))throw "a JSImplementation must implement all functions, you forgot JSContactListener::PreSolve.";b.PreSolve(c,d);},3103:function(b,c,d){b=a.getCache(a.JSContactListener)[b];if(!b.hasOwnProperty("PostSolve"))throw "a JSImplementation must implement all functions, you forgot JSContactListener::PostSolve.";
b.PostSolve(c,d);},3452:function(b,c,d){b=a.getCache(a.JSContactFilter)[b];if(!b.hasOwnProperty("ShouldCollide"))throw "a JSImplementation must implement all functions, you forgot JSContactFilter::ShouldCollide.";return b.ShouldCollide(c,d)},3744:function(b,c,d,f){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawPolygon"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawPolygon.";b.DrawPolygon(c,d,f);},3968:function(b,c,d,f){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawSolidPolygon"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSolidPolygon.";
b.DrawSolidPolygon(c,d,f);},4202:function(b,c,d,f){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawCircle"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawCircle.";b.DrawCircle(c,d,f);},4423:function(b,c,d,f,y){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawSolidCircle"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSolidCircle.";b.DrawSolidCircle(c,d,f,y);},4663:function(b,c,d,f){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawSegment"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSegment.";
b.DrawSegment(c,d,f);},4887:function(b,c){b=a.getCache(a.JSDraw)[b];if(!b.hasOwnProperty("DrawTransform"))throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawTransform.";b.DrawTransform(c);}};Ha.push({ev:function(){Wa();}});var Xa=[null,[],[]];function Ya(b,c){Za||(Za=[]);var d=Za;d.length=0;for(var f;f=za[b++];)100===f||102===f?(c=c+7&-8,d.push(Ca[c>>3]),c+=8):(c=c+3&-4,d.push(Ba[c>>2]),c+=4);return d}
var Za,$a={a:function(b,c,d,f){na("Assertion failed: "+xa(b)+", at: "+[c?xa(c):"unknown filename",d,f?xa(f):"unknown function"]);},g:function(){na();},d:function(b,c,d){c=Ya(c,d);return Va[b].apply(null,c)},b:function(b,c,d){c=Ya(c,d);return Va[b].apply(null,c)},e:function(b,c,d){za.copyWithin(b,c,c+d);},f:function(b){b>>>=0;var c=za.length;if(2147483648<b)return !1;for(var d=1;4>=d;d*=2){var f=c*(1+.2/d);f=Math.min(f,b+100663296);f=Math.max(16777216,b,f);0<f%65536&&(f+=65536-f%65536);a:{try{sa.grow(Math.min(2147483648,
f)-Aa.byteLength+65535>>>16);Da(sa.buffer);var y=1;break a}catch(oa){}y=void 0;}if(y)return !0}return !1},c:function(b,c,d,f){for(var y=0,oa=0;oa<d;oa++){for(var ya=Ba[c+8*oa>>2],ab=Ba[c+(8*oa+4)>>2],jb=0;jb<ab;jb++){var kb=za[ya+jb],lb=Xa[b];0===kb||10===kb?((1===b?pa:qa)(wa(lb,0)),lb.length=0):lb.push(kb);}y+=ab;}Ba[f>>2]=y;return 0},memory:sa,table:ta},bb=function(){function b(y){a.asm=y.exports;Ma--;a.monitorRunDependencies&&a.monitorRunDependencies(Ma);0==Ma&&(null!==Na&&(clearInterval(Na),Na=null),
Oa&&(y=Oa,Oa=null,y()));}function c(y){b(y.instance);}function d(y){return Ua().then(function(oa){return WebAssembly.instantiate(oa,f)}).then(y,function(oa){qa("failed to asynchronously prepare wasm: "+oa);na(oa);})}var f={a:$a};Ma++;a.monitorRunDependencies&&a.monitorRunDependencies(Ma);if(a.instantiateWasm)try{return a.instantiateWasm(f,b)}catch(y){return qa("Module.instantiateWasm callback failed with error: "+y),!1}(function(){if(ra||"function"!==typeof WebAssembly.instantiateStreaming||Ra()||Pa("file://")||
"function"!==typeof fetch)return d(c);fetch(Qa,{credentials:"same-origin"}).then(function(y){return WebAssembly.instantiateStreaming(y,f).then(c,function(oa){qa("wasm streaming compile failed: "+oa);qa("falling back to ArrayBuffer instantiation");d(c);})});})();return {}}();a.asm=bb;var Wa=a.___wasm_call_ctors=function(){return (Wa=a.___wasm_call_ctors=a.asm.h).apply(null,arguments)};a.___em_js__array_bounds_check_error=function(){return (a.___em_js__array_bounds_check_error=a.asm.i).apply(null,arguments)};
var cb=a._emscripten_bind_b2DestructionListenerWrapper___destroy___0=function(){return (cb=a._emscripten_bind_b2DestructionListenerWrapper___destroy___0=a.asm.j).apply(null,arguments)},db=a._emscripten_bind_b2Draw_SetFlags_1=function(){return (db=a._emscripten_bind_b2Draw_SetFlags_1=a.asm.k).apply(null,arguments)},eb=a._emscripten_bind_b2Draw_GetFlags_0=function(){return (eb=a._emscripten_bind_b2Draw_GetFlags_0=a.asm.l).apply(null,arguments)},fb=a._emscripten_bind_b2Draw_AppendFlags_1=function(){return (fb=
a._emscripten_bind_b2Draw_AppendFlags_1=a.asm.m).apply(null,arguments)},gb=a._emscripten_bind_b2Draw_ClearFlags_1=function(){return (gb=a._emscripten_bind_b2Draw_ClearFlags_1=a.asm.n).apply(null,arguments)},hb=a._emscripten_bind_b2Draw___destroy___0=function(){return (hb=a._emscripten_bind_b2Draw___destroy___0=a.asm.o).apply(null,arguments)},ib=a._emscripten_bind_b2Joint_GetType_0=function(){return (ib=a._emscripten_bind_b2Joint_GetType_0=a.asm.p).apply(null,arguments)},mb=a._emscripten_bind_b2Joint_GetBodyA_0=
function(){return (mb=a._emscripten_bind_b2Joint_GetBodyA_0=a.asm.q).apply(null,arguments)},nb=a._emscripten_bind_b2Joint_GetBodyB_0=function(){return (nb=a._emscripten_bind_b2Joint_GetBodyB_0=a.asm.r).apply(null,arguments)},ob=a._emscripten_bind_b2Joint_GetAnchorA_0=function(){return (ob=a._emscripten_bind_b2Joint_GetAnchorA_0=a.asm.s).apply(null,arguments)},pb=a._emscripten_bind_b2Joint_GetAnchorB_0=function(){return (pb=a._emscripten_bind_b2Joint_GetAnchorB_0=a.asm.t).apply(null,arguments)},qb=a._emscripten_bind_b2Joint_GetReactionForce_1=
function(){return (qb=a._emscripten_bind_b2Joint_GetReactionForce_1=a.asm.u).apply(null,arguments)},rb=a._emscripten_bind_b2Joint_GetReactionTorque_1=function(){return (rb=a._emscripten_bind_b2Joint_GetReactionTorque_1=a.asm.v).apply(null,arguments)},sb=a._emscripten_bind_b2Joint_GetNext_0=function(){return (sb=a._emscripten_bind_b2Joint_GetNext_0=a.asm.w).apply(null,arguments)},tb=a._emscripten_bind_b2Joint_GetUserData_0=function(){return (tb=a._emscripten_bind_b2Joint_GetUserData_0=a.asm.x).apply(null,
arguments)},ub=a._emscripten_bind_b2Joint_SetUserData_1=function(){return (ub=a._emscripten_bind_b2Joint_SetUserData_1=a.asm.y).apply(null,arguments)},vb=a._emscripten_bind_b2Joint_IsActive_0=function(){return (vb=a._emscripten_bind_b2Joint_IsActive_0=a.asm.z).apply(null,arguments)},wb=a._emscripten_bind_b2Joint_GetCollideConnected_0=function(){return (wb=a._emscripten_bind_b2Joint_GetCollideConnected_0=a.asm.A).apply(null,arguments)},xb=a._emscripten_bind_b2Joint_Dump_0=function(){return (xb=a._emscripten_bind_b2Joint_Dump_0=
a.asm.B).apply(null,arguments)},yb=a._emscripten_bind_b2RayCastCallback___destroy___0=function(){return (yb=a._emscripten_bind_b2RayCastCallback___destroy___0=a.asm.C).apply(null,arguments)},zb=a._emscripten_bind_b2ContactListener___destroy___0=function(){return (zb=a._emscripten_bind_b2ContactListener___destroy___0=a.asm.D).apply(null,arguments)},Ab=a._emscripten_bind_b2QueryCallback___destroy___0=function(){return (Ab=a._emscripten_bind_b2QueryCallback___destroy___0=a.asm.E).apply(null,arguments)},
Bb=a._emscripten_bind_b2JointDef_b2JointDef_0=function(){return (Bb=a._emscripten_bind_b2JointDef_b2JointDef_0=a.asm.F).apply(null,arguments)},Cb=a._emscripten_bind_b2JointDef_get_type_0=function(){return (Cb=a._emscripten_bind_b2JointDef_get_type_0=a.asm.G).apply(null,arguments)},Db=a._emscripten_bind_b2JointDef_set_type_1=function(){return (Db=a._emscripten_bind_b2JointDef_set_type_1=a.asm.H).apply(null,arguments)},Eb=a._emscripten_bind_b2JointDef_get_userData_0=function(){return (Eb=a._emscripten_bind_b2JointDef_get_userData_0=
a.asm.I).apply(null,arguments)},Fb=a._emscripten_bind_b2JointDef_set_userData_1=function(){return (Fb=a._emscripten_bind_b2JointDef_set_userData_1=a.asm.J).apply(null,arguments)},Gb=a._emscripten_bind_b2JointDef_get_bodyA_0=function(){return (Gb=a._emscripten_bind_b2JointDef_get_bodyA_0=a.asm.K).apply(null,arguments)},Hb=a._emscripten_bind_b2JointDef_set_bodyA_1=function(){return (Hb=a._emscripten_bind_b2JointDef_set_bodyA_1=a.asm.L).apply(null,arguments)},Ib=a._emscripten_bind_b2JointDef_get_bodyB_0=
function(){return (Ib=a._emscripten_bind_b2JointDef_get_bodyB_0=a.asm.M).apply(null,arguments)},Jb=a._emscripten_bind_b2JointDef_set_bodyB_1=function(){return (Jb=a._emscripten_bind_b2JointDef_set_bodyB_1=a.asm.N).apply(null,arguments)},Kb=a._emscripten_bind_b2JointDef_get_collideConnected_0=function(){return (Kb=a._emscripten_bind_b2JointDef_get_collideConnected_0=a.asm.O).apply(null,arguments)},Lb=a._emscripten_bind_b2JointDef_set_collideConnected_1=function(){return (Lb=a._emscripten_bind_b2JointDef_set_collideConnected_1=
a.asm.P).apply(null,arguments)},Mb=a._emscripten_bind_b2JointDef___destroy___0=function(){return (Mb=a._emscripten_bind_b2JointDef___destroy___0=a.asm.Q).apply(null,arguments)},Nb=a._emscripten_bind_b2Shape_GetType_0=function(){return (Nb=a._emscripten_bind_b2Shape_GetType_0=a.asm.R).apply(null,arguments)},Ob=a._emscripten_bind_b2Shape_GetChildCount_0=function(){return (Ob=a._emscripten_bind_b2Shape_GetChildCount_0=a.asm.S).apply(null,arguments)},Pb=a._emscripten_bind_b2Shape_TestPoint_2=function(){return (Pb=
a._emscripten_bind_b2Shape_TestPoint_2=a.asm.T).apply(null,arguments)},Qb=a._emscripten_bind_b2Shape_RayCast_4=function(){return (Qb=a._emscripten_bind_b2Shape_RayCast_4=a.asm.U).apply(null,arguments)},Rb=a._emscripten_bind_b2Shape_ComputeAABB_3=function(){return (Rb=a._emscripten_bind_b2Shape_ComputeAABB_3=a.asm.V).apply(null,arguments)},Sb=a._emscripten_bind_b2Shape_ComputeMass_2=function(){return (Sb=a._emscripten_bind_b2Shape_ComputeMass_2=a.asm.W).apply(null,arguments)},Tb=a._emscripten_bind_b2Shape_get_m_type_0=
function(){return (Tb=a._emscripten_bind_b2Shape_get_m_type_0=a.asm.X).apply(null,arguments)},Ub=a._emscripten_bind_b2Shape_set_m_type_1=function(){return (Ub=a._emscripten_bind_b2Shape_set_m_type_1=a.asm.Y).apply(null,arguments)},Vb=a._emscripten_bind_b2Shape_get_m_radius_0=function(){return (Vb=a._emscripten_bind_b2Shape_get_m_radius_0=a.asm.Z).apply(null,arguments)},Wb=a._emscripten_bind_b2Shape_set_m_radius_1=function(){return (Wb=a._emscripten_bind_b2Shape_set_m_radius_1=a.asm._).apply(null,arguments)},
Xb=a._emscripten_bind_b2Shape___destroy___0=function(){return (Xb=a._emscripten_bind_b2Shape___destroy___0=a.asm.$).apply(null,arguments)},Yb=a._emscripten_bind_b2ContactFilter___destroy___0=function(){return (Yb=a._emscripten_bind_b2ContactFilter___destroy___0=a.asm.aa).apply(null,arguments)},Zb=a._emscripten_bind_JSDestructionListener_JSDestructionListener_0=function(){return (Zb=a._emscripten_bind_JSDestructionListener_JSDestructionListener_0=a.asm.ba).apply(null,arguments)},$b=a._emscripten_bind_JSDestructionListener_SayGoodbyeJoint_1=
function(){return ($b=a._emscripten_bind_JSDestructionListener_SayGoodbyeJoint_1=a.asm.ca).apply(null,arguments)},ac=a._emscripten_bind_JSDestructionListener_SayGoodbyeFixture_1=function(){return (ac=a._emscripten_bind_JSDestructionListener_SayGoodbyeFixture_1=a.asm.da).apply(null,arguments)},bc=a._emscripten_bind_JSDestructionListener___destroy___0=function(){return (bc=a._emscripten_bind_JSDestructionListener___destroy___0=a.asm.ea).apply(null,arguments)},cc=a._emscripten_bind_b2ContactImpulse_get_count_0=
function(){return (cc=a._emscripten_bind_b2ContactImpulse_get_count_0=a.asm.fa).apply(null,arguments)},dc=a._emscripten_bind_b2ContactImpulse_set_count_1=function(){return (dc=a._emscripten_bind_b2ContactImpulse_set_count_1=a.asm.ga).apply(null,arguments)},ec=a._emscripten_bind_b2ContactImpulse___destroy___0=function(){return (ec=a._emscripten_bind_b2ContactImpulse___destroy___0=a.asm.ha).apply(null,arguments)},fc=a._emscripten_bind_b2DistanceJoint_GetLocalAnchorA_0=function(){return (fc=a._emscripten_bind_b2DistanceJoint_GetLocalAnchorA_0=
a.asm.ia).apply(null,arguments)},hc=a._emscripten_bind_b2DistanceJoint_GetLocalAnchorB_0=function(){return (hc=a._emscripten_bind_b2DistanceJoint_GetLocalAnchorB_0=a.asm.ja).apply(null,arguments)},ic=a._emscripten_bind_b2DistanceJoint_SetLength_1=function(){return (ic=a._emscripten_bind_b2DistanceJoint_SetLength_1=a.asm.ka).apply(null,arguments)},jc=a._emscripten_bind_b2DistanceJoint_GetLength_0=function(){return (jc=a._emscripten_bind_b2DistanceJoint_GetLength_0=a.asm.la).apply(null,arguments)},kc=
a._emscripten_bind_b2DistanceJoint_SetFrequency_1=function(){return (kc=a._emscripten_bind_b2DistanceJoint_SetFrequency_1=a.asm.ma).apply(null,arguments)},lc=a._emscripten_bind_b2DistanceJoint_GetFrequency_0=function(){return (lc=a._emscripten_bind_b2DistanceJoint_GetFrequency_0=a.asm.na).apply(null,arguments)},mc=a._emscripten_bind_b2DistanceJoint_SetDampingRatio_1=function(){return (mc=a._emscripten_bind_b2DistanceJoint_SetDampingRatio_1=a.asm.oa).apply(null,arguments)},nc=a._emscripten_bind_b2DistanceJoint_GetDampingRatio_0=
function(){return (nc=a._emscripten_bind_b2DistanceJoint_GetDampingRatio_0=a.asm.pa).apply(null,arguments)},oc=a._emscripten_bind_b2DistanceJoint_GetType_0=function(){return (oc=a._emscripten_bind_b2DistanceJoint_GetType_0=a.asm.qa).apply(null,arguments)},pc=a._emscripten_bind_b2DistanceJoint_GetBodyA_0=function(){return (pc=a._emscripten_bind_b2DistanceJoint_GetBodyA_0=a.asm.ra).apply(null,arguments)},qc=a._emscripten_bind_b2DistanceJoint_GetBodyB_0=function(){return (qc=a._emscripten_bind_b2DistanceJoint_GetBodyB_0=
a.asm.sa).apply(null,arguments)},rc=a._emscripten_bind_b2DistanceJoint_GetAnchorA_0=function(){return (rc=a._emscripten_bind_b2DistanceJoint_GetAnchorA_0=a.asm.ta).apply(null,arguments)},sc=a._emscripten_bind_b2DistanceJoint_GetAnchorB_0=function(){return (sc=a._emscripten_bind_b2DistanceJoint_GetAnchorB_0=a.asm.ua).apply(null,arguments)},tc=a._emscripten_bind_b2DistanceJoint_GetReactionForce_1=function(){return (tc=a._emscripten_bind_b2DistanceJoint_GetReactionForce_1=a.asm.va).apply(null,arguments)},
uc=a._emscripten_bind_b2DistanceJoint_GetReactionTorque_1=function(){return (uc=a._emscripten_bind_b2DistanceJoint_GetReactionTorque_1=a.asm.wa).apply(null,arguments)},vc=a._emscripten_bind_b2DistanceJoint_GetNext_0=function(){return (vc=a._emscripten_bind_b2DistanceJoint_GetNext_0=a.asm.xa).apply(null,arguments)},wc=a._emscripten_bind_b2DistanceJoint_GetUserData_0=function(){return (wc=a._emscripten_bind_b2DistanceJoint_GetUserData_0=a.asm.ya).apply(null,arguments)},xc=a._emscripten_bind_b2DistanceJoint_SetUserData_1=
function(){return (xc=a._emscripten_bind_b2DistanceJoint_SetUserData_1=a.asm.za).apply(null,arguments)},yc=a._emscripten_bind_b2DistanceJoint_IsActive_0=function(){return (yc=a._emscripten_bind_b2DistanceJoint_IsActive_0=a.asm.Aa).apply(null,arguments)},zc=a._emscripten_bind_b2DistanceJoint_GetCollideConnected_0=function(){return (zc=a._emscripten_bind_b2DistanceJoint_GetCollideConnected_0=a.asm.Ba).apply(null,arguments)},Ac=a._emscripten_bind_b2DistanceJoint___destroy___0=function(){return (Ac=a._emscripten_bind_b2DistanceJoint___destroy___0=
a.asm.Ca).apply(null,arguments)},Bc=a._emscripten_bind_b2Mat33_b2Mat33_0=function(){return (Bc=a._emscripten_bind_b2Mat33_b2Mat33_0=a.asm.Da).apply(null,arguments)},Cc=a._emscripten_bind_b2Mat33_b2Mat33_3=function(){return (Cc=a._emscripten_bind_b2Mat33_b2Mat33_3=a.asm.Ea).apply(null,arguments)},Dc=a._emscripten_bind_b2Mat33_SetZero_0=function(){return (Dc=a._emscripten_bind_b2Mat33_SetZero_0=a.asm.Fa).apply(null,arguments)},Ec=a._emscripten_bind_b2Mat33_Solve33_1=function(){return (Ec=a._emscripten_bind_b2Mat33_Solve33_1=
a.asm.Ga).apply(null,arguments)},Fc=a._emscripten_bind_b2Mat33_Solve22_1=function(){return (Fc=a._emscripten_bind_b2Mat33_Solve22_1=a.asm.Ha).apply(null,arguments)},Gc=a._emscripten_bind_b2Mat33_GetInverse22_1=function(){return (Gc=a._emscripten_bind_b2Mat33_GetInverse22_1=a.asm.Ia).apply(null,arguments)},Hc=a._emscripten_bind_b2Mat33_GetSymInverse33_1=function(){return (Hc=a._emscripten_bind_b2Mat33_GetSymInverse33_1=a.asm.Ja).apply(null,arguments)},Ic=a._emscripten_bind_b2Mat33_get_ex_0=function(){return (Ic=
a._emscripten_bind_b2Mat33_get_ex_0=a.asm.Ka).apply(null,arguments)},Jc=a._emscripten_bind_b2Mat33_set_ex_1=function(){return (Jc=a._emscripten_bind_b2Mat33_set_ex_1=a.asm.La).apply(null,arguments)},Kc=a._emscripten_bind_b2Mat33_get_ey_0=function(){return (Kc=a._emscripten_bind_b2Mat33_get_ey_0=a.asm.Ma).apply(null,arguments)},Lc=a._emscripten_bind_b2Mat33_set_ey_1=function(){return (Lc=a._emscripten_bind_b2Mat33_set_ey_1=a.asm.Na).apply(null,arguments)},Mc=a._emscripten_bind_b2Mat33_get_ez_0=function(){return (Mc=
a._emscripten_bind_b2Mat33_get_ez_0=a.asm.Oa).apply(null,arguments)},Nc=a._emscripten_bind_b2Mat33_set_ez_1=function(){return (Nc=a._emscripten_bind_b2Mat33_set_ez_1=a.asm.Pa).apply(null,arguments)},Oc=a._emscripten_bind_b2Mat33___destroy___0=function(){return (Oc=a._emscripten_bind_b2Mat33___destroy___0=a.asm.Qa).apply(null,arguments)},Pc=a._emscripten_bind_b2Fixture_GetType_0=function(){return (Pc=a._emscripten_bind_b2Fixture_GetType_0=a.asm.Ra).apply(null,arguments)},Qc=a._emscripten_bind_b2Fixture_GetShape_0=
function(){return (Qc=a._emscripten_bind_b2Fixture_GetShape_0=a.asm.Sa).apply(null,arguments)},Rc=a._emscripten_bind_b2Fixture_SetSensor_1=function(){return (Rc=a._emscripten_bind_b2Fixture_SetSensor_1=a.asm.Ta).apply(null,arguments)},Sc=a._emscripten_bind_b2Fixture_IsSensor_0=function(){return (Sc=a._emscripten_bind_b2Fixture_IsSensor_0=a.asm.Ua).apply(null,arguments)},Tc=a._emscripten_bind_b2Fixture_SetFilterData_1=function(){return (Tc=a._emscripten_bind_b2Fixture_SetFilterData_1=a.asm.Va).apply(null,
arguments)},Uc=a._emscripten_bind_b2Fixture_GetFilterData_0=function(){return (Uc=a._emscripten_bind_b2Fixture_GetFilterData_0=a.asm.Wa).apply(null,arguments)},Vc=a._emscripten_bind_b2Fixture_Refilter_0=function(){return (Vc=a._emscripten_bind_b2Fixture_Refilter_0=a.asm.Xa).apply(null,arguments)},Wc=a._emscripten_bind_b2Fixture_GetBody_0=function(){return (Wc=a._emscripten_bind_b2Fixture_GetBody_0=a.asm.Ya).apply(null,arguments)},Xc=a._emscripten_bind_b2Fixture_GetNext_0=function(){return (Xc=a._emscripten_bind_b2Fixture_GetNext_0=
a.asm.Za).apply(null,arguments)},Yc=a._emscripten_bind_b2Fixture_GetUserData_0=function(){return (Yc=a._emscripten_bind_b2Fixture_GetUserData_0=a.asm._a).apply(null,arguments)},Zc=a._emscripten_bind_b2Fixture_SetUserData_1=function(){return (Zc=a._emscripten_bind_b2Fixture_SetUserData_1=a.asm.$a).apply(null,arguments)},$c=a._emscripten_bind_b2Fixture_TestPoint_1=function(){return ($c=a._emscripten_bind_b2Fixture_TestPoint_1=a.asm.ab).apply(null,arguments)},ad=a._emscripten_bind_b2Fixture_RayCast_3=function(){return (ad=
a._emscripten_bind_b2Fixture_RayCast_3=a.asm.bb).apply(null,arguments)},bd=a._emscripten_bind_b2Fixture_GetMassData_1=function(){return (bd=a._emscripten_bind_b2Fixture_GetMassData_1=a.asm.cb).apply(null,arguments)},cd=a._emscripten_bind_b2Fixture_SetDensity_1=function(){return (cd=a._emscripten_bind_b2Fixture_SetDensity_1=a.asm.db).apply(null,arguments)},dd=a._emscripten_bind_b2Fixture_GetDensity_0=function(){return (dd=a._emscripten_bind_b2Fixture_GetDensity_0=a.asm.eb).apply(null,arguments)},ed=a._emscripten_bind_b2Fixture_GetFriction_0=
function(){return (ed=a._emscripten_bind_b2Fixture_GetFriction_0=a.asm.fb).apply(null,arguments)},fd=a._emscripten_bind_b2Fixture_SetFriction_1=function(){return (fd=a._emscripten_bind_b2Fixture_SetFriction_1=a.asm.gb).apply(null,arguments)},gd=a._emscripten_bind_b2Fixture_GetRestitution_0=function(){return (gd=a._emscripten_bind_b2Fixture_GetRestitution_0=a.asm.hb).apply(null,arguments)},hd=a._emscripten_bind_b2Fixture_SetRestitution_1=function(){return (hd=a._emscripten_bind_b2Fixture_SetRestitution_1=
a.asm.ib).apply(null,arguments)},id=a._emscripten_bind_b2Fixture_GetAABB_1=function(){return (id=a._emscripten_bind_b2Fixture_GetAABB_1=a.asm.jb).apply(null,arguments)},jd=a._emscripten_bind_b2Fixture_Dump_1=function(){return (jd=a._emscripten_bind_b2Fixture_Dump_1=a.asm.kb).apply(null,arguments)},kd=a._emscripten_bind_b2Fixture___destroy___0=function(){return (kd=a._emscripten_bind_b2Fixture___destroy___0=a.asm.lb).apply(null,arguments)},ld=a._emscripten_bind_b2Filter_b2Filter_0=function(){return (ld=
a._emscripten_bind_b2Filter_b2Filter_0=a.asm.mb).apply(null,arguments)},md=a._emscripten_bind_b2Filter_get_categoryBits_0=function(){return (md=a._emscripten_bind_b2Filter_get_categoryBits_0=a.asm.nb).apply(null,arguments)},nd=a._emscripten_bind_b2Filter_set_categoryBits_1=function(){return (nd=a._emscripten_bind_b2Filter_set_categoryBits_1=a.asm.ob).apply(null,arguments)},od=a._emscripten_bind_b2Filter_get_maskBits_0=function(){return (od=a._emscripten_bind_b2Filter_get_maskBits_0=a.asm.pb).apply(null,
arguments)},pd=a._emscripten_bind_b2Filter_set_maskBits_1=function(){return (pd=a._emscripten_bind_b2Filter_set_maskBits_1=a.asm.qb).apply(null,arguments)},qd=a._emscripten_bind_b2Filter_get_groupIndex_0=function(){return (qd=a._emscripten_bind_b2Filter_get_groupIndex_0=a.asm.rb).apply(null,arguments)},rd=a._emscripten_bind_b2Filter_set_groupIndex_1=function(){return (rd=a._emscripten_bind_b2Filter_set_groupIndex_1=a.asm.sb).apply(null,arguments)},sd=a._emscripten_bind_b2Filter___destroy___0=function(){return (sd=
a._emscripten_bind_b2Filter___destroy___0=a.asm.tb).apply(null,arguments)},td=a._emscripten_bind_JSQueryCallback_JSQueryCallback_0=function(){return (td=a._emscripten_bind_JSQueryCallback_JSQueryCallback_0=a.asm.ub).apply(null,arguments)},ud=a._emscripten_bind_JSQueryCallback_ReportFixture_1=function(){return (ud=a._emscripten_bind_JSQueryCallback_ReportFixture_1=a.asm.vb).apply(null,arguments)},vd=a._emscripten_bind_JSQueryCallback___destroy___0=function(){return (vd=a._emscripten_bind_JSQueryCallback___destroy___0=
a.asm.wb).apply(null,arguments)},wd=a._emscripten_bind_b2MouseJoint_SetTarget_1=function(){return (wd=a._emscripten_bind_b2MouseJoint_SetTarget_1=a.asm.xb).apply(null,arguments)},xd=a._emscripten_bind_b2MouseJoint_GetTarget_0=function(){return (xd=a._emscripten_bind_b2MouseJoint_GetTarget_0=a.asm.yb).apply(null,arguments)},yd=a._emscripten_bind_b2MouseJoint_SetMaxForce_1=function(){return (yd=a._emscripten_bind_b2MouseJoint_SetMaxForce_1=a.asm.zb).apply(null,arguments)},zd=a._emscripten_bind_b2MouseJoint_GetMaxForce_0=
function(){return (zd=a._emscripten_bind_b2MouseJoint_GetMaxForce_0=a.asm.Ab).apply(null,arguments)},Ad=a._emscripten_bind_b2MouseJoint_SetFrequency_1=function(){return (Ad=a._emscripten_bind_b2MouseJoint_SetFrequency_1=a.asm.Bb).apply(null,arguments)},Bd=a._emscripten_bind_b2MouseJoint_GetFrequency_0=function(){return (Bd=a._emscripten_bind_b2MouseJoint_GetFrequency_0=a.asm.Cb).apply(null,arguments)},Cd=a._emscripten_bind_b2MouseJoint_SetDampingRatio_1=function(){return (Cd=a._emscripten_bind_b2MouseJoint_SetDampingRatio_1=
a.asm.Db).apply(null,arguments)},Dd=a._emscripten_bind_b2MouseJoint_GetDampingRatio_0=function(){return (Dd=a._emscripten_bind_b2MouseJoint_GetDampingRatio_0=a.asm.Eb).apply(null,arguments)},Ed=a._emscripten_bind_b2MouseJoint_GetType_0=function(){return (Ed=a._emscripten_bind_b2MouseJoint_GetType_0=a.asm.Fb).apply(null,arguments)},Fd=a._emscripten_bind_b2MouseJoint_GetBodyA_0=function(){return (Fd=a._emscripten_bind_b2MouseJoint_GetBodyA_0=a.asm.Gb).apply(null,arguments)},Gd=a._emscripten_bind_b2MouseJoint_GetBodyB_0=
function(){return (Gd=a._emscripten_bind_b2MouseJoint_GetBodyB_0=a.asm.Hb).apply(null,arguments)},Hd=a._emscripten_bind_b2MouseJoint_GetAnchorA_0=function(){return (Hd=a._emscripten_bind_b2MouseJoint_GetAnchorA_0=a.asm.Ib).apply(null,arguments)},Id=a._emscripten_bind_b2MouseJoint_GetAnchorB_0=function(){return (Id=a._emscripten_bind_b2MouseJoint_GetAnchorB_0=a.asm.Jb).apply(null,arguments)},Jd=a._emscripten_bind_b2MouseJoint_GetReactionForce_1=function(){return (Jd=a._emscripten_bind_b2MouseJoint_GetReactionForce_1=
a.asm.Kb).apply(null,arguments)},Kd=a._emscripten_bind_b2MouseJoint_GetReactionTorque_1=function(){return (Kd=a._emscripten_bind_b2MouseJoint_GetReactionTorque_1=a.asm.Lb).apply(null,arguments)},Ld=a._emscripten_bind_b2MouseJoint_GetNext_0=function(){return (Ld=a._emscripten_bind_b2MouseJoint_GetNext_0=a.asm.Mb).apply(null,arguments)},Md=a._emscripten_bind_b2MouseJoint_GetUserData_0=function(){return (Md=a._emscripten_bind_b2MouseJoint_GetUserData_0=a.asm.Nb).apply(null,arguments)},Nd=a._emscripten_bind_b2MouseJoint_SetUserData_1=
function(){return (Nd=a._emscripten_bind_b2MouseJoint_SetUserData_1=a.asm.Ob).apply(null,arguments)},Od=a._emscripten_bind_b2MouseJoint_IsActive_0=function(){return (Od=a._emscripten_bind_b2MouseJoint_IsActive_0=a.asm.Pb).apply(null,arguments)},Pd=a._emscripten_bind_b2MouseJoint_GetCollideConnected_0=function(){return (Pd=a._emscripten_bind_b2MouseJoint_GetCollideConnected_0=a.asm.Qb).apply(null,arguments)},Qd=a._emscripten_bind_b2MouseJoint___destroy___0=function(){return (Qd=a._emscripten_bind_b2MouseJoint___destroy___0=
a.asm.Rb).apply(null,arguments)},Rd=a._emscripten_bind_b2Rot_b2Rot_0=function(){return (Rd=a._emscripten_bind_b2Rot_b2Rot_0=a.asm.Sb).apply(null,arguments)},Sd=a._emscripten_bind_b2Rot_b2Rot_1=function(){return (Sd=a._emscripten_bind_b2Rot_b2Rot_1=a.asm.Tb).apply(null,arguments)},Td=a._emscripten_bind_b2Rot_Set_1=function(){return (Td=a._emscripten_bind_b2Rot_Set_1=a.asm.Ub).apply(null,arguments)},Ud=a._emscripten_bind_b2Rot_SetIdentity_0=function(){return (Ud=a._emscripten_bind_b2Rot_SetIdentity_0=a.asm.Vb).apply(null,
arguments)},Vd=a._emscripten_bind_b2Rot_GetAngle_0=function(){return (Vd=a._emscripten_bind_b2Rot_GetAngle_0=a.asm.Wb).apply(null,arguments)},Wd=a._emscripten_bind_b2Rot_GetXAxis_0=function(){return (Wd=a._emscripten_bind_b2Rot_GetXAxis_0=a.asm.Xb).apply(null,arguments)},Xd=a._emscripten_bind_b2Rot_GetYAxis_0=function(){return (Xd=a._emscripten_bind_b2Rot_GetYAxis_0=a.asm.Yb).apply(null,arguments)},Yd=a._emscripten_bind_b2Rot_get_s_0=function(){return (Yd=a._emscripten_bind_b2Rot_get_s_0=a.asm.Zb).apply(null,
arguments)},Zd=a._emscripten_bind_b2Rot_set_s_1=function(){return (Zd=a._emscripten_bind_b2Rot_set_s_1=a.asm._b).apply(null,arguments)},$d=a._emscripten_bind_b2Rot_get_c_0=function(){return ($d=a._emscripten_bind_b2Rot_get_c_0=a.asm.$b).apply(null,arguments)},ae=a._emscripten_bind_b2Rot_set_c_1=function(){return (ae=a._emscripten_bind_b2Rot_set_c_1=a.asm.ac).apply(null,arguments)},be=a._emscripten_bind_b2Rot___destroy___0=function(){return (be=a._emscripten_bind_b2Rot___destroy___0=a.asm.bc).apply(null,
arguments)},ce=a._emscripten_bind_b2MotorJoint_SetLinearOffset_1=function(){return (ce=a._emscripten_bind_b2MotorJoint_SetLinearOffset_1=a.asm.cc).apply(null,arguments)},de=a._emscripten_bind_b2MotorJoint_GetLinearOffset_0=function(){return (de=a._emscripten_bind_b2MotorJoint_GetLinearOffset_0=a.asm.dc).apply(null,arguments)},ee=a._emscripten_bind_b2MotorJoint_SetAngularOffset_1=function(){return (ee=a._emscripten_bind_b2MotorJoint_SetAngularOffset_1=a.asm.ec).apply(null,arguments)},fe=a._emscripten_bind_b2MotorJoint_GetAngularOffset_0=
function(){return (fe=a._emscripten_bind_b2MotorJoint_GetAngularOffset_0=a.asm.fc).apply(null,arguments)},ge=a._emscripten_bind_b2MotorJoint_SetMaxForce_1=function(){return (ge=a._emscripten_bind_b2MotorJoint_SetMaxForce_1=a.asm.gc).apply(null,arguments)},he=a._emscripten_bind_b2MotorJoint_GetMaxForce_0=function(){return (he=a._emscripten_bind_b2MotorJoint_GetMaxForce_0=a.asm.hc).apply(null,arguments)},ie=a._emscripten_bind_b2MotorJoint_SetMaxTorque_1=function(){return (ie=a._emscripten_bind_b2MotorJoint_SetMaxTorque_1=
a.asm.ic).apply(null,arguments)},je=a._emscripten_bind_b2MotorJoint_GetMaxTorque_0=function(){return (je=a._emscripten_bind_b2MotorJoint_GetMaxTorque_0=a.asm.jc).apply(null,arguments)},ke=a._emscripten_bind_b2MotorJoint_SetCorrectionFactor_1=function(){return (ke=a._emscripten_bind_b2MotorJoint_SetCorrectionFactor_1=a.asm.kc).apply(null,arguments)},le=a._emscripten_bind_b2MotorJoint_GetCorrectionFactor_0=function(){return (le=a._emscripten_bind_b2MotorJoint_GetCorrectionFactor_0=a.asm.lc).apply(null,
arguments)},me=a._emscripten_bind_b2MotorJoint_GetType_0=function(){return (me=a._emscripten_bind_b2MotorJoint_GetType_0=a.asm.mc).apply(null,arguments)},ne=a._emscripten_bind_b2MotorJoint_GetBodyA_0=function(){return (ne=a._emscripten_bind_b2MotorJoint_GetBodyA_0=a.asm.nc).apply(null,arguments)},oe=a._emscripten_bind_b2MotorJoint_GetBodyB_0=function(){return (oe=a._emscripten_bind_b2MotorJoint_GetBodyB_0=a.asm.oc).apply(null,arguments)},pe=a._emscripten_bind_b2MotorJoint_GetAnchorA_0=function(){return (pe=
a._emscripten_bind_b2MotorJoint_GetAnchorA_0=a.asm.pc).apply(null,arguments)},qe=a._emscripten_bind_b2MotorJoint_GetAnchorB_0=function(){return (qe=a._emscripten_bind_b2MotorJoint_GetAnchorB_0=a.asm.qc).apply(null,arguments)},re=a._emscripten_bind_b2MotorJoint_GetReactionForce_1=function(){return (re=a._emscripten_bind_b2MotorJoint_GetReactionForce_1=a.asm.rc).apply(null,arguments)},se=a._emscripten_bind_b2MotorJoint_GetReactionTorque_1=function(){return (se=a._emscripten_bind_b2MotorJoint_GetReactionTorque_1=
a.asm.sc).apply(null,arguments)},te=a._emscripten_bind_b2MotorJoint_GetNext_0=function(){return (te=a._emscripten_bind_b2MotorJoint_GetNext_0=a.asm.tc).apply(null,arguments)},ue=a._emscripten_bind_b2MotorJoint_GetUserData_0=function(){return (ue=a._emscripten_bind_b2MotorJoint_GetUserData_0=a.asm.uc).apply(null,arguments)},ve=a._emscripten_bind_b2MotorJoint_SetUserData_1=function(){return (ve=a._emscripten_bind_b2MotorJoint_SetUserData_1=a.asm.vc).apply(null,arguments)},we=a._emscripten_bind_b2MotorJoint_IsActive_0=
function(){return (we=a._emscripten_bind_b2MotorJoint_IsActive_0=a.asm.wc).apply(null,arguments)},xe=a._emscripten_bind_b2MotorJoint_GetCollideConnected_0=function(){return (xe=a._emscripten_bind_b2MotorJoint_GetCollideConnected_0=a.asm.xc).apply(null,arguments)},ye=a._emscripten_bind_b2MotorJoint___destroy___0=function(){return (ye=a._emscripten_bind_b2MotorJoint___destroy___0=a.asm.yc).apply(null,arguments)},ze=a._emscripten_bind_b2Profile_get_step_0=function(){return (ze=a._emscripten_bind_b2Profile_get_step_0=
a.asm.zc).apply(null,arguments)},Ae=a._emscripten_bind_b2Profile_set_step_1=function(){return (Ae=a._emscripten_bind_b2Profile_set_step_1=a.asm.Ac).apply(null,arguments)},Be=a._emscripten_bind_b2Profile_get_collide_0=function(){return (Be=a._emscripten_bind_b2Profile_get_collide_0=a.asm.Bc).apply(null,arguments)},Ce=a._emscripten_bind_b2Profile_set_collide_1=function(){return (Ce=a._emscripten_bind_b2Profile_set_collide_1=a.asm.Cc).apply(null,arguments)},De=a._emscripten_bind_b2Profile_get_solve_0=function(){return (De=
a._emscripten_bind_b2Profile_get_solve_0=a.asm.Dc).apply(null,arguments)},Ee=a._emscripten_bind_b2Profile_set_solve_1=function(){return (Ee=a._emscripten_bind_b2Profile_set_solve_1=a.asm.Ec).apply(null,arguments)},Fe=a._emscripten_bind_b2Profile_get_solveInit_0=function(){return (Fe=a._emscripten_bind_b2Profile_get_solveInit_0=a.asm.Fc).apply(null,arguments)},Ge=a._emscripten_bind_b2Profile_set_solveInit_1=function(){return (Ge=a._emscripten_bind_b2Profile_set_solveInit_1=a.asm.Gc).apply(null,arguments)},
He=a._emscripten_bind_b2Profile_get_solveVelocity_0=function(){return (He=a._emscripten_bind_b2Profile_get_solveVelocity_0=a.asm.Hc).apply(null,arguments)},Ie=a._emscripten_bind_b2Profile_set_solveVelocity_1=function(){return (Ie=a._emscripten_bind_b2Profile_set_solveVelocity_1=a.asm.Ic).apply(null,arguments)},Je=a._emscripten_bind_b2Profile_get_solvePosition_0=function(){return (Je=a._emscripten_bind_b2Profile_get_solvePosition_0=a.asm.Jc).apply(null,arguments)},Ke=a._emscripten_bind_b2Profile_set_solvePosition_1=
function(){return (Ke=a._emscripten_bind_b2Profile_set_solvePosition_1=a.asm.Kc).apply(null,arguments)},Le=a._emscripten_bind_b2Profile_get_broadphase_0=function(){return (Le=a._emscripten_bind_b2Profile_get_broadphase_0=a.asm.Lc).apply(null,arguments)},Me=a._emscripten_bind_b2Profile_set_broadphase_1=function(){return (Me=a._emscripten_bind_b2Profile_set_broadphase_1=a.asm.Mc).apply(null,arguments)},Ne=a._emscripten_bind_b2Profile_get_solveTOI_0=function(){return (Ne=a._emscripten_bind_b2Profile_get_solveTOI_0=
a.asm.Nc).apply(null,arguments)},Oe=a._emscripten_bind_b2Profile_set_solveTOI_1=function(){return (Oe=a._emscripten_bind_b2Profile_set_solveTOI_1=a.asm.Oc).apply(null,arguments)},Pe=a._emscripten_bind_b2Profile___destroy___0=function(){return (Pe=a._emscripten_bind_b2Profile___destroy___0=a.asm.Pc).apply(null,arguments)},Qe=a._emscripten_bind_VoidPtr___destroy___0=function(){return (Qe=a._emscripten_bind_VoidPtr___destroy___0=a.asm.Qc).apply(null,arguments)},Re=a._emscripten_bind_b2BodyDef_b2BodyDef_0=
function(){return (Re=a._emscripten_bind_b2BodyDef_b2BodyDef_0=a.asm.Rc).apply(null,arguments)},Se=a._emscripten_bind_b2BodyDef_get_type_0=function(){return (Se=a._emscripten_bind_b2BodyDef_get_type_0=a.asm.Sc).apply(null,arguments)},Te=a._emscripten_bind_b2BodyDef_set_type_1=function(){return (Te=a._emscripten_bind_b2BodyDef_set_type_1=a.asm.Tc).apply(null,arguments)},Ue=a._emscripten_bind_b2BodyDef_get_position_0=function(){return (Ue=a._emscripten_bind_b2BodyDef_get_position_0=a.asm.Uc).apply(null,
arguments)},Ve=a._emscripten_bind_b2BodyDef_set_position_1=function(){return (Ve=a._emscripten_bind_b2BodyDef_set_position_1=a.asm.Vc).apply(null,arguments)},We=a._emscripten_bind_b2BodyDef_get_angle_0=function(){return (We=a._emscripten_bind_b2BodyDef_get_angle_0=a.asm.Wc).apply(null,arguments)},Xe=a._emscripten_bind_b2BodyDef_set_angle_1=function(){return (Xe=a._emscripten_bind_b2BodyDef_set_angle_1=a.asm.Xc).apply(null,arguments)},Ye=a._emscripten_bind_b2BodyDef_get_linearVelocity_0=function(){return (Ye=
a._emscripten_bind_b2BodyDef_get_linearVelocity_0=a.asm.Yc).apply(null,arguments)},Ze=a._emscripten_bind_b2BodyDef_set_linearVelocity_1=function(){return (Ze=a._emscripten_bind_b2BodyDef_set_linearVelocity_1=a.asm.Zc).apply(null,arguments)},$e=a._emscripten_bind_b2BodyDef_get_angularVelocity_0=function(){return ($e=a._emscripten_bind_b2BodyDef_get_angularVelocity_0=a.asm._c).apply(null,arguments)},af=a._emscripten_bind_b2BodyDef_set_angularVelocity_1=function(){return (af=a._emscripten_bind_b2BodyDef_set_angularVelocity_1=
a.asm.$c).apply(null,arguments)},bf=a._emscripten_bind_b2BodyDef_get_linearDamping_0=function(){return (bf=a._emscripten_bind_b2BodyDef_get_linearDamping_0=a.asm.ad).apply(null,arguments)},cf=a._emscripten_bind_b2BodyDef_set_linearDamping_1=function(){return (cf=a._emscripten_bind_b2BodyDef_set_linearDamping_1=a.asm.bd).apply(null,arguments)},df=a._emscripten_bind_b2BodyDef_get_angularDamping_0=function(){return (df=a._emscripten_bind_b2BodyDef_get_angularDamping_0=a.asm.cd).apply(null,arguments)},ef=
a._emscripten_bind_b2BodyDef_set_angularDamping_1=function(){return (ef=a._emscripten_bind_b2BodyDef_set_angularDamping_1=a.asm.dd).apply(null,arguments)},ff=a._emscripten_bind_b2BodyDef_get_allowSleep_0=function(){return (ff=a._emscripten_bind_b2BodyDef_get_allowSleep_0=a.asm.ed).apply(null,arguments)},gf=a._emscripten_bind_b2BodyDef_set_allowSleep_1=function(){return (gf=a._emscripten_bind_b2BodyDef_set_allowSleep_1=a.asm.fd).apply(null,arguments)},hf=a._emscripten_bind_b2BodyDef_get_awake_0=function(){return (hf=
a._emscripten_bind_b2BodyDef_get_awake_0=a.asm.gd).apply(null,arguments)},jf=a._emscripten_bind_b2BodyDef_set_awake_1=function(){return (jf=a._emscripten_bind_b2BodyDef_set_awake_1=a.asm.hd).apply(null,arguments)},kf=a._emscripten_bind_b2BodyDef_get_fixedRotation_0=function(){return (kf=a._emscripten_bind_b2BodyDef_get_fixedRotation_0=a.asm.id).apply(null,arguments)},lf=a._emscripten_bind_b2BodyDef_set_fixedRotation_1=function(){return (lf=a._emscripten_bind_b2BodyDef_set_fixedRotation_1=a.asm.jd).apply(null,
arguments)},mf=a._emscripten_bind_b2BodyDef_get_bullet_0=function(){return (mf=a._emscripten_bind_b2BodyDef_get_bullet_0=a.asm.kd).apply(null,arguments)},nf=a._emscripten_bind_b2BodyDef_set_bullet_1=function(){return (nf=a._emscripten_bind_b2BodyDef_set_bullet_1=a.asm.ld).apply(null,arguments)},of=a._emscripten_bind_b2BodyDef_get_active_0=function(){return (of=a._emscripten_bind_b2BodyDef_get_active_0=a.asm.md).apply(null,arguments)},pf=a._emscripten_bind_b2BodyDef_set_active_1=function(){return (pf=
a._emscripten_bind_b2BodyDef_set_active_1=a.asm.nd).apply(null,arguments)},qf=a._emscripten_bind_b2BodyDef_get_userData_0=function(){return (qf=a._emscripten_bind_b2BodyDef_get_userData_0=a.asm.od).apply(null,arguments)},rf=a._emscripten_bind_b2BodyDef_set_userData_1=function(){return (rf=a._emscripten_bind_b2BodyDef_set_userData_1=a.asm.pd).apply(null,arguments)},sf=a._emscripten_bind_b2BodyDef_get_gravityScale_0=function(){return (sf=a._emscripten_bind_b2BodyDef_get_gravityScale_0=a.asm.qd).apply(null,
arguments)},tf=a._emscripten_bind_b2BodyDef_set_gravityScale_1=function(){return (tf=a._emscripten_bind_b2BodyDef_set_gravityScale_1=a.asm.rd).apply(null,arguments)},uf=a._emscripten_bind_b2BodyDef___destroy___0=function(){return (uf=a._emscripten_bind_b2BodyDef___destroy___0=a.asm.sd).apply(null,arguments)},vf=a._emscripten_bind_JSRayCastCallback_JSRayCastCallback_0=function(){return (vf=a._emscripten_bind_JSRayCastCallback_JSRayCastCallback_0=a.asm.td).apply(null,arguments)},wf=a._emscripten_bind_JSRayCastCallback_ReportFixture_4=
function(){return (wf=a._emscripten_bind_JSRayCastCallback_ReportFixture_4=a.asm.ud).apply(null,arguments)},xf=a._emscripten_bind_JSRayCastCallback___destroy___0=function(){return (xf=a._emscripten_bind_JSRayCastCallback___destroy___0=a.asm.vd).apply(null,arguments)},yf=a._emscripten_bind_b2ContactFeature_get_indexA_0=function(){return (yf=a._emscripten_bind_b2ContactFeature_get_indexA_0=a.asm.wd).apply(null,arguments)},zf=a._emscripten_bind_b2ContactFeature_set_indexA_1=function(){return (zf=a._emscripten_bind_b2ContactFeature_set_indexA_1=
a.asm.xd).apply(null,arguments)},Af=a._emscripten_bind_b2ContactFeature_get_indexB_0=function(){return (Af=a._emscripten_bind_b2ContactFeature_get_indexB_0=a.asm.yd).apply(null,arguments)},Bf=a._emscripten_bind_b2ContactFeature_set_indexB_1=function(){return (Bf=a._emscripten_bind_b2ContactFeature_set_indexB_1=a.asm.zd).apply(null,arguments)},Cf=a._emscripten_bind_b2ContactFeature_get_typeA_0=function(){return (Cf=a._emscripten_bind_b2ContactFeature_get_typeA_0=a.asm.Ad).apply(null,arguments)},Df=a._emscripten_bind_b2ContactFeature_set_typeA_1=
function(){return (Df=a._emscripten_bind_b2ContactFeature_set_typeA_1=a.asm.Bd).apply(null,arguments)},Ef=a._emscripten_bind_b2ContactFeature_get_typeB_0=function(){return (Ef=a._emscripten_bind_b2ContactFeature_get_typeB_0=a.asm.Cd).apply(null,arguments)},Ff=a._emscripten_bind_b2ContactFeature_set_typeB_1=function(){return (Ff=a._emscripten_bind_b2ContactFeature_set_typeB_1=a.asm.Dd).apply(null,arguments)},Gf=a._emscripten_bind_b2ContactFeature___destroy___0=function(){return (Gf=a._emscripten_bind_b2ContactFeature___destroy___0=
a.asm.Ed).apply(null,arguments)},Hf=a._emscripten_bind_b2Vec2_b2Vec2_0=function(){return (Hf=a._emscripten_bind_b2Vec2_b2Vec2_0=a.asm.Fd).apply(null,arguments)},If=a._emscripten_bind_b2Vec2_b2Vec2_2=function(){return (If=a._emscripten_bind_b2Vec2_b2Vec2_2=a.asm.Gd).apply(null,arguments)},Jf=a._emscripten_bind_b2Vec2_SetZero_0=function(){return (Jf=a._emscripten_bind_b2Vec2_SetZero_0=a.asm.Hd).apply(null,arguments)},Kf=a._emscripten_bind_b2Vec2_Set_2=function(){return (Kf=a._emscripten_bind_b2Vec2_Set_2=
a.asm.Id).apply(null,arguments)},Lf=a._emscripten_bind_b2Vec2_op_add_1=function(){return (Lf=a._emscripten_bind_b2Vec2_op_add_1=a.asm.Jd).apply(null,arguments)},Mf=a._emscripten_bind_b2Vec2_op_sub_1=function(){return (Mf=a._emscripten_bind_b2Vec2_op_sub_1=a.asm.Kd).apply(null,arguments)},Nf=a._emscripten_bind_b2Vec2_op_mul_1=function(){return (Nf=a._emscripten_bind_b2Vec2_op_mul_1=a.asm.Ld).apply(null,arguments)},Of=a._emscripten_bind_b2Vec2_Length_0=function(){return (Of=a._emscripten_bind_b2Vec2_Length_0=
a.asm.Md).apply(null,arguments)},Pf=a._emscripten_bind_b2Vec2_LengthSquared_0=function(){return (Pf=a._emscripten_bind_b2Vec2_LengthSquared_0=a.asm.Nd).apply(null,arguments)},Qf=a._emscripten_bind_b2Vec2_Normalize_0=function(){return (Qf=a._emscripten_bind_b2Vec2_Normalize_0=a.asm.Od).apply(null,arguments)},Rf=a._emscripten_bind_b2Vec2_IsValid_0=function(){return (Rf=a._emscripten_bind_b2Vec2_IsValid_0=a.asm.Pd).apply(null,arguments)},Sf=a._emscripten_bind_b2Vec2_Skew_0=function(){return (Sf=a._emscripten_bind_b2Vec2_Skew_0=
a.asm.Qd).apply(null,arguments)},Tf=a._emscripten_bind_b2Vec2_get_x_0=function(){return (Tf=a._emscripten_bind_b2Vec2_get_x_0=a.asm.Rd).apply(null,arguments)},Uf=a._emscripten_bind_b2Vec2_set_x_1=function(){return (Uf=a._emscripten_bind_b2Vec2_set_x_1=a.asm.Sd).apply(null,arguments)},Vf=a._emscripten_bind_b2Vec2_get_y_0=function(){return (Vf=a._emscripten_bind_b2Vec2_get_y_0=a.asm.Td).apply(null,arguments)},Wf=a._emscripten_bind_b2Vec2_set_y_1=function(){return (Wf=a._emscripten_bind_b2Vec2_set_y_1=a.asm.Ud).apply(null,
arguments)},Xf=a._emscripten_bind_b2Vec2___destroy___0=function(){return (Xf=a._emscripten_bind_b2Vec2___destroy___0=a.asm.Vd).apply(null,arguments)},Yf=a._emscripten_bind_b2Vec3_b2Vec3_0=function(){return (Yf=a._emscripten_bind_b2Vec3_b2Vec3_0=a.asm.Wd).apply(null,arguments)},Zf=a._emscripten_bind_b2Vec3_b2Vec3_3=function(){return (Zf=a._emscripten_bind_b2Vec3_b2Vec3_3=a.asm.Xd).apply(null,arguments)},$f=a._emscripten_bind_b2Vec3_SetZero_0=function(){return ($f=a._emscripten_bind_b2Vec3_SetZero_0=a.asm.Yd).apply(null,
arguments)},ag=a._emscripten_bind_b2Vec3_Set_3=function(){return (ag=a._emscripten_bind_b2Vec3_Set_3=a.asm.Zd).apply(null,arguments)},bg=a._emscripten_bind_b2Vec3_op_add_1=function(){return (bg=a._emscripten_bind_b2Vec3_op_add_1=a.asm._d).apply(null,arguments)},cg=a._emscripten_bind_b2Vec3_op_sub_1=function(){return (cg=a._emscripten_bind_b2Vec3_op_sub_1=a.asm.$d).apply(null,arguments)},dg=a._emscripten_bind_b2Vec3_op_mul_1=function(){return (dg=a._emscripten_bind_b2Vec3_op_mul_1=a.asm.ae).apply(null,
arguments)},eg=a._emscripten_bind_b2Vec3_get_x_0=function(){return (eg=a._emscripten_bind_b2Vec3_get_x_0=a.asm.be).apply(null,arguments)},fg=a._emscripten_bind_b2Vec3_set_x_1=function(){return (fg=a._emscripten_bind_b2Vec3_set_x_1=a.asm.ce).apply(null,arguments)},gg=a._emscripten_bind_b2Vec3_get_y_0=function(){return (gg=a._emscripten_bind_b2Vec3_get_y_0=a.asm.de).apply(null,arguments)},hg=a._emscripten_bind_b2Vec3_set_y_1=function(){return (hg=a._emscripten_bind_b2Vec3_set_y_1=a.asm.ee).apply(null,arguments)},
ig=a._emscripten_bind_b2Vec3_get_z_0=function(){return (ig=a._emscripten_bind_b2Vec3_get_z_0=a.asm.fe).apply(null,arguments)},jg=a._emscripten_bind_b2Vec3_set_z_1=function(){return (jg=a._emscripten_bind_b2Vec3_set_z_1=a.asm.ge).apply(null,arguments)},kg=a._emscripten_bind_b2Vec3___destroy___0=function(){return (kg=a._emscripten_bind_b2Vec3___destroy___0=a.asm.he).apply(null,arguments)},lg=a._emscripten_bind_b2AABB_b2AABB_0=function(){return (lg=a._emscripten_bind_b2AABB_b2AABB_0=a.asm.ie).apply(null,
arguments)},mg=a._emscripten_bind_b2AABB_IsValid_0=function(){return (mg=a._emscripten_bind_b2AABB_IsValid_0=a.asm.je).apply(null,arguments)},ng=a._emscripten_bind_b2AABB_GetCenter_0=function(){return (ng=a._emscripten_bind_b2AABB_GetCenter_0=a.asm.ke).apply(null,arguments)},og=a._emscripten_bind_b2AABB_GetExtents_0=function(){return (og=a._emscripten_bind_b2AABB_GetExtents_0=a.asm.le).apply(null,arguments)},pg=a._emscripten_bind_b2AABB_GetPerimeter_0=function(){return (pg=a._emscripten_bind_b2AABB_GetPerimeter_0=
a.asm.me).apply(null,arguments)},qg=a._emscripten_bind_b2AABB_Combine_1=function(){return (qg=a._emscripten_bind_b2AABB_Combine_1=a.asm.ne).apply(null,arguments)},rg=a._emscripten_bind_b2AABB_Combine_2=function(){return (rg=a._emscripten_bind_b2AABB_Combine_2=a.asm.oe).apply(null,arguments)},sg=a._emscripten_bind_b2AABB_Contains_1=function(){return (sg=a._emscripten_bind_b2AABB_Contains_1=a.asm.pe).apply(null,arguments)},tg=a._emscripten_bind_b2AABB_RayCast_2=function(){return (tg=a._emscripten_bind_b2AABB_RayCast_2=
a.asm.qe).apply(null,arguments)},ug=a._emscripten_bind_b2AABB_get_lowerBound_0=function(){return (ug=a._emscripten_bind_b2AABB_get_lowerBound_0=a.asm.re).apply(null,arguments)},vg=a._emscripten_bind_b2AABB_set_lowerBound_1=function(){return (vg=a._emscripten_bind_b2AABB_set_lowerBound_1=a.asm.se).apply(null,arguments)},wg=a._emscripten_bind_b2AABB_get_upperBound_0=function(){return (wg=a._emscripten_bind_b2AABB_get_upperBound_0=a.asm.te).apply(null,arguments)},xg=a._emscripten_bind_b2AABB_set_upperBound_1=
function(){return (xg=a._emscripten_bind_b2AABB_set_upperBound_1=a.asm.ue).apply(null,arguments)},yg=a._emscripten_bind_b2AABB___destroy___0=function(){return (yg=a._emscripten_bind_b2AABB___destroy___0=a.asm.ve).apply(null,arguments)},zg=a._emscripten_bind_b2FixtureDef_b2FixtureDef_0=function(){return (zg=a._emscripten_bind_b2FixtureDef_b2FixtureDef_0=a.asm.we).apply(null,arguments)},Ag=a._emscripten_bind_b2FixtureDef_get_shape_0=function(){return (Ag=a._emscripten_bind_b2FixtureDef_get_shape_0=a.asm.xe).apply(null,
arguments)},Bg=a._emscripten_bind_b2FixtureDef_set_shape_1=function(){return (Bg=a._emscripten_bind_b2FixtureDef_set_shape_1=a.asm.ye).apply(null,arguments)},Cg=a._emscripten_bind_b2FixtureDef_get_userData_0=function(){return (Cg=a._emscripten_bind_b2FixtureDef_get_userData_0=a.asm.ze).apply(null,arguments)},Dg=a._emscripten_bind_b2FixtureDef_set_userData_1=function(){return (Dg=a._emscripten_bind_b2FixtureDef_set_userData_1=a.asm.Ae).apply(null,arguments)},Eg=a._emscripten_bind_b2FixtureDef_get_friction_0=
function(){return (Eg=a._emscripten_bind_b2FixtureDef_get_friction_0=a.asm.Be).apply(null,arguments)},Fg=a._emscripten_bind_b2FixtureDef_set_friction_1=function(){return (Fg=a._emscripten_bind_b2FixtureDef_set_friction_1=a.asm.Ce).apply(null,arguments)},Gg=a._emscripten_bind_b2FixtureDef_get_restitution_0=function(){return (Gg=a._emscripten_bind_b2FixtureDef_get_restitution_0=a.asm.De).apply(null,arguments)},Hg=a._emscripten_bind_b2FixtureDef_set_restitution_1=function(){return (Hg=a._emscripten_bind_b2FixtureDef_set_restitution_1=
a.asm.Ee).apply(null,arguments)},Ig=a._emscripten_bind_b2FixtureDef_get_density_0=function(){return (Ig=a._emscripten_bind_b2FixtureDef_get_density_0=a.asm.Fe).apply(null,arguments)},Jg=a._emscripten_bind_b2FixtureDef_set_density_1=function(){return (Jg=a._emscripten_bind_b2FixtureDef_set_density_1=a.asm.Ge).apply(null,arguments)},Kg=a._emscripten_bind_b2FixtureDef_get_isSensor_0=function(){return (Kg=a._emscripten_bind_b2FixtureDef_get_isSensor_0=a.asm.He).apply(null,arguments)},Lg=a._emscripten_bind_b2FixtureDef_set_isSensor_1=
function(){return (Lg=a._emscripten_bind_b2FixtureDef_set_isSensor_1=a.asm.Ie).apply(null,arguments)},Mg=a._emscripten_bind_b2FixtureDef_get_filter_0=function(){return (Mg=a._emscripten_bind_b2FixtureDef_get_filter_0=a.asm.Je).apply(null,arguments)},Ng=a._emscripten_bind_b2FixtureDef_set_filter_1=function(){return (Ng=a._emscripten_bind_b2FixtureDef_set_filter_1=a.asm.Ke).apply(null,arguments)},Og=a._emscripten_bind_b2FixtureDef___destroy___0=function(){return (Og=a._emscripten_bind_b2FixtureDef___destroy___0=
a.asm.Le).apply(null,arguments)},Pg=a._emscripten_bind_b2FrictionJointDef_b2FrictionJointDef_0=function(){return (Pg=a._emscripten_bind_b2FrictionJointDef_b2FrictionJointDef_0=a.asm.Me).apply(null,arguments)},Qg=a._emscripten_bind_b2FrictionJointDef_Initialize_3=function(){return (Qg=a._emscripten_bind_b2FrictionJointDef_Initialize_3=a.asm.Ne).apply(null,arguments)},Rg=a._emscripten_bind_b2FrictionJointDef_get_localAnchorA_0=function(){return (Rg=a._emscripten_bind_b2FrictionJointDef_get_localAnchorA_0=
a.asm.Oe).apply(null,arguments)},Sg=a._emscripten_bind_b2FrictionJointDef_set_localAnchorA_1=function(){return (Sg=a._emscripten_bind_b2FrictionJointDef_set_localAnchorA_1=a.asm.Pe).apply(null,arguments)},Tg=a._emscripten_bind_b2FrictionJointDef_get_localAnchorB_0=function(){return (Tg=a._emscripten_bind_b2FrictionJointDef_get_localAnchorB_0=a.asm.Qe).apply(null,arguments)},Ug=a._emscripten_bind_b2FrictionJointDef_set_localAnchorB_1=function(){return (Ug=a._emscripten_bind_b2FrictionJointDef_set_localAnchorB_1=
a.asm.Re).apply(null,arguments)},Vg=a._emscripten_bind_b2FrictionJointDef_get_maxForce_0=function(){return (Vg=a._emscripten_bind_b2FrictionJointDef_get_maxForce_0=a.asm.Se).apply(null,arguments)},Wg=a._emscripten_bind_b2FrictionJointDef_set_maxForce_1=function(){return (Wg=a._emscripten_bind_b2FrictionJointDef_set_maxForce_1=a.asm.Te).apply(null,arguments)},Xg=a._emscripten_bind_b2FrictionJointDef_get_maxTorque_0=function(){return (Xg=a._emscripten_bind_b2FrictionJointDef_get_maxTorque_0=a.asm.Ue).apply(null,
arguments)},Yg=a._emscripten_bind_b2FrictionJointDef_set_maxTorque_1=function(){return (Yg=a._emscripten_bind_b2FrictionJointDef_set_maxTorque_1=a.asm.Ve).apply(null,arguments)},Zg=a._emscripten_bind_b2FrictionJointDef_get_type_0=function(){return (Zg=a._emscripten_bind_b2FrictionJointDef_get_type_0=a.asm.We).apply(null,arguments)},$g=a._emscripten_bind_b2FrictionJointDef_set_type_1=function(){return ($g=a._emscripten_bind_b2FrictionJointDef_set_type_1=a.asm.Xe).apply(null,arguments)},ah=a._emscripten_bind_b2FrictionJointDef_get_userData_0=
function(){return (ah=a._emscripten_bind_b2FrictionJointDef_get_userData_0=a.asm.Ye).apply(null,arguments)},bh=a._emscripten_bind_b2FrictionJointDef_set_userData_1=function(){return (bh=a._emscripten_bind_b2FrictionJointDef_set_userData_1=a.asm.Ze).apply(null,arguments)},ch=a._emscripten_bind_b2FrictionJointDef_get_bodyA_0=function(){return (ch=a._emscripten_bind_b2FrictionJointDef_get_bodyA_0=a.asm._e).apply(null,arguments)},dh=a._emscripten_bind_b2FrictionJointDef_set_bodyA_1=function(){return (dh=
a._emscripten_bind_b2FrictionJointDef_set_bodyA_1=a.asm.$e).apply(null,arguments)},eh=a._emscripten_bind_b2FrictionJointDef_get_bodyB_0=function(){return (eh=a._emscripten_bind_b2FrictionJointDef_get_bodyB_0=a.asm.af).apply(null,arguments)},fh=a._emscripten_bind_b2FrictionJointDef_set_bodyB_1=function(){return (fh=a._emscripten_bind_b2FrictionJointDef_set_bodyB_1=a.asm.bf).apply(null,arguments)},gh=a._emscripten_bind_b2FrictionJointDef_get_collideConnected_0=function(){return (gh=a._emscripten_bind_b2FrictionJointDef_get_collideConnected_0=
a.asm.cf).apply(null,arguments)},hh=a._emscripten_bind_b2FrictionJointDef_set_collideConnected_1=function(){return (hh=a._emscripten_bind_b2FrictionJointDef_set_collideConnected_1=a.asm.df).apply(null,arguments)},ih=a._emscripten_bind_b2FrictionJointDef___destroy___0=function(){return (ih=a._emscripten_bind_b2FrictionJointDef___destroy___0=a.asm.ef).apply(null,arguments)},jh=a._emscripten_bind_b2Manifold_b2Manifold_0=function(){return (jh=a._emscripten_bind_b2Manifold_b2Manifold_0=a.asm.ff).apply(null,
arguments)},kh=a._emscripten_bind_b2Manifold_get_localNormal_0=function(){return (kh=a._emscripten_bind_b2Manifold_get_localNormal_0=a.asm.gf).apply(null,arguments)},lh=a._emscripten_bind_b2Manifold_set_localNormal_1=function(){return (lh=a._emscripten_bind_b2Manifold_set_localNormal_1=a.asm.hf).apply(null,arguments)},mh=a._emscripten_bind_b2Manifold_get_localPoint_0=function(){return (mh=a._emscripten_bind_b2Manifold_get_localPoint_0=a.asm.jf).apply(null,arguments)},nh=a._emscripten_bind_b2Manifold_set_localPoint_1=
function(){return (nh=a._emscripten_bind_b2Manifold_set_localPoint_1=a.asm.kf).apply(null,arguments)},oh=a._emscripten_bind_b2Manifold_get_type_0=function(){return (oh=a._emscripten_bind_b2Manifold_get_type_0=a.asm.lf).apply(null,arguments)},ph=a._emscripten_bind_b2Manifold_set_type_1=function(){return (ph=a._emscripten_bind_b2Manifold_set_type_1=a.asm.mf).apply(null,arguments)},qh=a._emscripten_bind_b2Manifold_get_pointCount_0=function(){return (qh=a._emscripten_bind_b2Manifold_get_pointCount_0=a.asm.nf).apply(null,
arguments)},rh=a._emscripten_bind_b2Manifold_set_pointCount_1=function(){return (rh=a._emscripten_bind_b2Manifold_set_pointCount_1=a.asm.of).apply(null,arguments)},sh=a._emscripten_bind_b2Manifold___destroy___0=function(){return (sh=a._emscripten_bind_b2Manifold___destroy___0=a.asm.pf).apply(null,arguments)},th=a._emscripten_bind_b2WorldManifold_b2WorldManifold_0=function(){return (th=a._emscripten_bind_b2WorldManifold_b2WorldManifold_0=a.asm.qf).apply(null,arguments)},uh=a._emscripten_bind_b2WorldManifold_Initialize_5=
function(){return (uh=a._emscripten_bind_b2WorldManifold_Initialize_5=a.asm.rf).apply(null,arguments)},vh=a._emscripten_bind_b2WorldManifold_get_normal_0=function(){return (vh=a._emscripten_bind_b2WorldManifold_get_normal_0=a.asm.sf).apply(null,arguments)},wh=a._emscripten_bind_b2WorldManifold_set_normal_1=function(){return (wh=a._emscripten_bind_b2WorldManifold_set_normal_1=a.asm.tf).apply(null,arguments)},xh=a._emscripten_bind_b2WorldManifold_get_points_1=function(){return (xh=a._emscripten_bind_b2WorldManifold_get_points_1=
a.asm.uf).apply(null,arguments)},yh=a._emscripten_bind_b2WorldManifold_set_points_2=function(){return (yh=a._emscripten_bind_b2WorldManifold_set_points_2=a.asm.vf).apply(null,arguments)},zh=a._emscripten_bind_b2WorldManifold_get_separations_1=function(){return (zh=a._emscripten_bind_b2WorldManifold_get_separations_1=a.asm.wf).apply(null,arguments)},Ah=a._emscripten_bind_b2WorldManifold_set_separations_2=function(){return (Ah=a._emscripten_bind_b2WorldManifold_set_separations_2=a.asm.xf).apply(null,arguments)},
Bh=a._emscripten_bind_b2WorldManifold___destroy___0=function(){return (Bh=a._emscripten_bind_b2WorldManifold___destroy___0=a.asm.yf).apply(null,arguments)},Ch=a._emscripten_bind_b2PrismaticJointDef_b2PrismaticJointDef_0=function(){return (Ch=a._emscripten_bind_b2PrismaticJointDef_b2PrismaticJointDef_0=a.asm.zf).apply(null,arguments)},Dh=a._emscripten_bind_b2PrismaticJointDef_Initialize_4=function(){return (Dh=a._emscripten_bind_b2PrismaticJointDef_Initialize_4=a.asm.Af).apply(null,arguments)},Eh=a._emscripten_bind_b2PrismaticJointDef_get_localAnchorA_0=
function(){return (Eh=a._emscripten_bind_b2PrismaticJointDef_get_localAnchorA_0=a.asm.Bf).apply(null,arguments)},Fh=a._emscripten_bind_b2PrismaticJointDef_set_localAnchorA_1=function(){return (Fh=a._emscripten_bind_b2PrismaticJointDef_set_localAnchorA_1=a.asm.Cf).apply(null,arguments)},Gh=a._emscripten_bind_b2PrismaticJointDef_get_localAnchorB_0=function(){return (Gh=a._emscripten_bind_b2PrismaticJointDef_get_localAnchorB_0=a.asm.Df).apply(null,arguments)},Hh=a._emscripten_bind_b2PrismaticJointDef_set_localAnchorB_1=
function(){return (Hh=a._emscripten_bind_b2PrismaticJointDef_set_localAnchorB_1=a.asm.Ef).apply(null,arguments)},Ih=a._emscripten_bind_b2PrismaticJointDef_get_localAxisA_0=function(){return (Ih=a._emscripten_bind_b2PrismaticJointDef_get_localAxisA_0=a.asm.Ff).apply(null,arguments)},Jh=a._emscripten_bind_b2PrismaticJointDef_set_localAxisA_1=function(){return (Jh=a._emscripten_bind_b2PrismaticJointDef_set_localAxisA_1=a.asm.Gf).apply(null,arguments)},Kh=a._emscripten_bind_b2PrismaticJointDef_get_referenceAngle_0=
function(){return (Kh=a._emscripten_bind_b2PrismaticJointDef_get_referenceAngle_0=a.asm.Hf).apply(null,arguments)},Lh=a._emscripten_bind_b2PrismaticJointDef_set_referenceAngle_1=function(){return (Lh=a._emscripten_bind_b2PrismaticJointDef_set_referenceAngle_1=a.asm.If).apply(null,arguments)},Mh=a._emscripten_bind_b2PrismaticJointDef_get_enableLimit_0=function(){return (Mh=a._emscripten_bind_b2PrismaticJointDef_get_enableLimit_0=a.asm.Jf).apply(null,arguments)},Nh=a._emscripten_bind_b2PrismaticJointDef_set_enableLimit_1=
function(){return (Nh=a._emscripten_bind_b2PrismaticJointDef_set_enableLimit_1=a.asm.Kf).apply(null,arguments)},Oh=a._emscripten_bind_b2PrismaticJointDef_get_lowerTranslation_0=function(){return (Oh=a._emscripten_bind_b2PrismaticJointDef_get_lowerTranslation_0=a.asm.Lf).apply(null,arguments)},Ph=a._emscripten_bind_b2PrismaticJointDef_set_lowerTranslation_1=function(){return (Ph=a._emscripten_bind_b2PrismaticJointDef_set_lowerTranslation_1=a.asm.Mf).apply(null,arguments)},Qh=a._emscripten_bind_b2PrismaticJointDef_get_upperTranslation_0=
function(){return (Qh=a._emscripten_bind_b2PrismaticJointDef_get_upperTranslation_0=a.asm.Nf).apply(null,arguments)},Rh=a._emscripten_bind_b2PrismaticJointDef_set_upperTranslation_1=function(){return (Rh=a._emscripten_bind_b2PrismaticJointDef_set_upperTranslation_1=a.asm.Of).apply(null,arguments)},Sh=a._emscripten_bind_b2PrismaticJointDef_get_enableMotor_0=function(){return (Sh=a._emscripten_bind_b2PrismaticJointDef_get_enableMotor_0=a.asm.Pf).apply(null,arguments)},Th=a._emscripten_bind_b2PrismaticJointDef_set_enableMotor_1=
function(){return (Th=a._emscripten_bind_b2PrismaticJointDef_set_enableMotor_1=a.asm.Qf).apply(null,arguments)},Uh=a._emscripten_bind_b2PrismaticJointDef_get_maxMotorForce_0=function(){return (Uh=a._emscripten_bind_b2PrismaticJointDef_get_maxMotorForce_0=a.asm.Rf).apply(null,arguments)},Vh=a._emscripten_bind_b2PrismaticJointDef_set_maxMotorForce_1=function(){return (Vh=a._emscripten_bind_b2PrismaticJointDef_set_maxMotorForce_1=a.asm.Sf).apply(null,arguments)},Wh=a._emscripten_bind_b2PrismaticJointDef_get_motorSpeed_0=
function(){return (Wh=a._emscripten_bind_b2PrismaticJointDef_get_motorSpeed_0=a.asm.Tf).apply(null,arguments)},Xh=a._emscripten_bind_b2PrismaticJointDef_set_motorSpeed_1=function(){return (Xh=a._emscripten_bind_b2PrismaticJointDef_set_motorSpeed_1=a.asm.Uf).apply(null,arguments)},Yh=a._emscripten_bind_b2PrismaticJointDef_get_type_0=function(){return (Yh=a._emscripten_bind_b2PrismaticJointDef_get_type_0=a.asm.Vf).apply(null,arguments)},Zh=a._emscripten_bind_b2PrismaticJointDef_set_type_1=function(){return (Zh=
a._emscripten_bind_b2PrismaticJointDef_set_type_1=a.asm.Wf).apply(null,arguments)},$h=a._emscripten_bind_b2PrismaticJointDef_get_userData_0=function(){return ($h=a._emscripten_bind_b2PrismaticJointDef_get_userData_0=a.asm.Xf).apply(null,arguments)},ai=a._emscripten_bind_b2PrismaticJointDef_set_userData_1=function(){return (ai=a._emscripten_bind_b2PrismaticJointDef_set_userData_1=a.asm.Yf).apply(null,arguments)},bi=a._emscripten_bind_b2PrismaticJointDef_get_bodyA_0=function(){return (bi=a._emscripten_bind_b2PrismaticJointDef_get_bodyA_0=
a.asm.Zf).apply(null,arguments)},ci=a._emscripten_bind_b2PrismaticJointDef_set_bodyA_1=function(){return (ci=a._emscripten_bind_b2PrismaticJointDef_set_bodyA_1=a.asm._f).apply(null,arguments)},di=a._emscripten_bind_b2PrismaticJointDef_get_bodyB_0=function(){return (di=a._emscripten_bind_b2PrismaticJointDef_get_bodyB_0=a.asm.$f).apply(null,arguments)},ei=a._emscripten_bind_b2PrismaticJointDef_set_bodyB_1=function(){return (ei=a._emscripten_bind_b2PrismaticJointDef_set_bodyB_1=a.asm.ag).apply(null,arguments)},
fi=a._emscripten_bind_b2PrismaticJointDef_get_collideConnected_0=function(){return (fi=a._emscripten_bind_b2PrismaticJointDef_get_collideConnected_0=a.asm.bg).apply(null,arguments)},gi=a._emscripten_bind_b2PrismaticJointDef_set_collideConnected_1=function(){return (gi=a._emscripten_bind_b2PrismaticJointDef_set_collideConnected_1=a.asm.cg).apply(null,arguments)},hi=a._emscripten_bind_b2PrismaticJointDef___destroy___0=function(){return (hi=a._emscripten_bind_b2PrismaticJointDef___destroy___0=a.asm.dg).apply(null,
arguments)},ii=a._emscripten_bind_b2World_b2World_1=function(){return (ii=a._emscripten_bind_b2World_b2World_1=a.asm.eg).apply(null,arguments)},ji=a._emscripten_bind_b2World_SetDestructionListener_1=function(){return (ji=a._emscripten_bind_b2World_SetDestructionListener_1=a.asm.fg).apply(null,arguments)},ki=a._emscripten_bind_b2World_SetContactFilter_1=function(){return (ki=a._emscripten_bind_b2World_SetContactFilter_1=a.asm.gg).apply(null,arguments)},li=a._emscripten_bind_b2World_SetContactListener_1=
function(){return (li=a._emscripten_bind_b2World_SetContactListener_1=a.asm.hg).apply(null,arguments)},mi=a._emscripten_bind_b2World_SetDebugDraw_1=function(){return (mi=a._emscripten_bind_b2World_SetDebugDraw_1=a.asm.ig).apply(null,arguments)},ni=a._emscripten_bind_b2World_CreateBody_1=function(){return (ni=a._emscripten_bind_b2World_CreateBody_1=a.asm.jg).apply(null,arguments)},oi=a._emscripten_bind_b2World_DestroyBody_1=function(){return (oi=a._emscripten_bind_b2World_DestroyBody_1=a.asm.kg).apply(null,
arguments)},pi=a._emscripten_bind_b2World_CreateJoint_1=function(){return (pi=a._emscripten_bind_b2World_CreateJoint_1=a.asm.lg).apply(null,arguments)},qi=a._emscripten_bind_b2World_DestroyJoint_1=function(){return (qi=a._emscripten_bind_b2World_DestroyJoint_1=a.asm.mg).apply(null,arguments)},ri=a._emscripten_bind_b2World_Step_3=function(){return (ri=a._emscripten_bind_b2World_Step_3=a.asm.ng).apply(null,arguments)},si=a._emscripten_bind_b2World_ClearForces_0=function(){return (si=a._emscripten_bind_b2World_ClearForces_0=
a.asm.og).apply(null,arguments)},ti=a._emscripten_bind_b2World_DrawDebugData_0=function(){return (ti=a._emscripten_bind_b2World_DrawDebugData_0=a.asm.pg).apply(null,arguments)},ui=a._emscripten_bind_b2World_QueryAABB_2=function(){return (ui=a._emscripten_bind_b2World_QueryAABB_2=a.asm.qg).apply(null,arguments)},vi=a._emscripten_bind_b2World_RayCast_3=function(){return (vi=a._emscripten_bind_b2World_RayCast_3=a.asm.rg).apply(null,arguments)},wi=a._emscripten_bind_b2World_GetBodyList_0=function(){return (wi=
a._emscripten_bind_b2World_GetBodyList_0=a.asm.sg).apply(null,arguments)},xi=a._emscripten_bind_b2World_GetJointList_0=function(){return (xi=a._emscripten_bind_b2World_GetJointList_0=a.asm.tg).apply(null,arguments)},yi=a._emscripten_bind_b2World_GetContactList_0=function(){return (yi=a._emscripten_bind_b2World_GetContactList_0=a.asm.ug).apply(null,arguments)},zi=a._emscripten_bind_b2World_SetAllowSleeping_1=function(){return (zi=a._emscripten_bind_b2World_SetAllowSleeping_1=a.asm.vg).apply(null,arguments)},
Ai=a._emscripten_bind_b2World_GetAllowSleeping_0=function(){return (Ai=a._emscripten_bind_b2World_GetAllowSleeping_0=a.asm.wg).apply(null,arguments)},Bi=a._emscripten_bind_b2World_SetWarmStarting_1=function(){return (Bi=a._emscripten_bind_b2World_SetWarmStarting_1=a.asm.xg).apply(null,arguments)},Ci=a._emscripten_bind_b2World_GetWarmStarting_0=function(){return (Ci=a._emscripten_bind_b2World_GetWarmStarting_0=a.asm.yg).apply(null,arguments)},Di=a._emscripten_bind_b2World_SetContinuousPhysics_1=function(){return (Di=
a._emscripten_bind_b2World_SetContinuousPhysics_1=a.asm.zg).apply(null,arguments)},Ei=a._emscripten_bind_b2World_GetContinuousPhysics_0=function(){return (Ei=a._emscripten_bind_b2World_GetContinuousPhysics_0=a.asm.Ag).apply(null,arguments)},Fi=a._emscripten_bind_b2World_SetSubStepping_1=function(){return (Fi=a._emscripten_bind_b2World_SetSubStepping_1=a.asm.Bg).apply(null,arguments)},Gi=a._emscripten_bind_b2World_GetSubStepping_0=function(){return (Gi=a._emscripten_bind_b2World_GetSubStepping_0=a.asm.Cg).apply(null,
arguments)},Hi=a._emscripten_bind_b2World_GetProxyCount_0=function(){return (Hi=a._emscripten_bind_b2World_GetProxyCount_0=a.asm.Dg).apply(null,arguments)},Ii=a._emscripten_bind_b2World_GetBodyCount_0=function(){return (Ii=a._emscripten_bind_b2World_GetBodyCount_0=a.asm.Eg).apply(null,arguments)},Ji=a._emscripten_bind_b2World_GetJointCount_0=function(){return (Ji=a._emscripten_bind_b2World_GetJointCount_0=a.asm.Fg).apply(null,arguments)},Ki=a._emscripten_bind_b2World_GetContactCount_0=function(){return (Ki=
a._emscripten_bind_b2World_GetContactCount_0=a.asm.Gg).apply(null,arguments)},Li=a._emscripten_bind_b2World_GetTreeHeight_0=function(){return (Li=a._emscripten_bind_b2World_GetTreeHeight_0=a.asm.Hg).apply(null,arguments)},Mi=a._emscripten_bind_b2World_GetTreeBalance_0=function(){return (Mi=a._emscripten_bind_b2World_GetTreeBalance_0=a.asm.Ig).apply(null,arguments)},Ni=a._emscripten_bind_b2World_GetTreeQuality_0=function(){return (Ni=a._emscripten_bind_b2World_GetTreeQuality_0=a.asm.Jg).apply(null,arguments)},
Oi=a._emscripten_bind_b2World_SetGravity_1=function(){return (Oi=a._emscripten_bind_b2World_SetGravity_1=a.asm.Kg).apply(null,arguments)},Pi=a._emscripten_bind_b2World_GetGravity_0=function(){return (Pi=a._emscripten_bind_b2World_GetGravity_0=a.asm.Lg).apply(null,arguments)},Qi=a._emscripten_bind_b2World_IsLocked_0=function(){return (Qi=a._emscripten_bind_b2World_IsLocked_0=a.asm.Mg).apply(null,arguments)},Ri=a._emscripten_bind_b2World_SetAutoClearForces_1=function(){return (Ri=a._emscripten_bind_b2World_SetAutoClearForces_1=
a.asm.Ng).apply(null,arguments)},Si=a._emscripten_bind_b2World_GetAutoClearForces_0=function(){return (Si=a._emscripten_bind_b2World_GetAutoClearForces_0=a.asm.Og).apply(null,arguments)},Ti=a._emscripten_bind_b2World_GetProfile_0=function(){return (Ti=a._emscripten_bind_b2World_GetProfile_0=a.asm.Pg).apply(null,arguments)},Ui=a._emscripten_bind_b2World_Dump_0=function(){return (Ui=a._emscripten_bind_b2World_Dump_0=a.asm.Qg).apply(null,arguments)},Vi=a._emscripten_bind_b2World___destroy___0=function(){return (Vi=
a._emscripten_bind_b2World___destroy___0=a.asm.Rg).apply(null,arguments)},Wi=a._emscripten_bind_b2PrismaticJoint_GetLocalAnchorA_0=function(){return (Wi=a._emscripten_bind_b2PrismaticJoint_GetLocalAnchorA_0=a.asm.Sg).apply(null,arguments)},Xi=a._emscripten_bind_b2PrismaticJoint_GetLocalAnchorB_0=function(){return (Xi=a._emscripten_bind_b2PrismaticJoint_GetLocalAnchorB_0=a.asm.Tg).apply(null,arguments)},Yi=a._emscripten_bind_b2PrismaticJoint_GetLocalAxisA_0=function(){return (Yi=a._emscripten_bind_b2PrismaticJoint_GetLocalAxisA_0=
a.asm.Ug).apply(null,arguments)},Zi=a._emscripten_bind_b2PrismaticJoint_GetReferenceAngle_0=function(){return (Zi=a._emscripten_bind_b2PrismaticJoint_GetReferenceAngle_0=a.asm.Vg).apply(null,arguments)},$i=a._emscripten_bind_b2PrismaticJoint_GetJointTranslation_0=function(){return ($i=a._emscripten_bind_b2PrismaticJoint_GetJointTranslation_0=a.asm.Wg).apply(null,arguments)},aj=a._emscripten_bind_b2PrismaticJoint_GetJointSpeed_0=function(){return (aj=a._emscripten_bind_b2PrismaticJoint_GetJointSpeed_0=
a.asm.Xg).apply(null,arguments)},bj=a._emscripten_bind_b2PrismaticJoint_IsLimitEnabled_0=function(){return (bj=a._emscripten_bind_b2PrismaticJoint_IsLimitEnabled_0=a.asm.Yg).apply(null,arguments)},cj=a._emscripten_bind_b2PrismaticJoint_EnableLimit_1=function(){return (cj=a._emscripten_bind_b2PrismaticJoint_EnableLimit_1=a.asm.Zg).apply(null,arguments)},dj=a._emscripten_bind_b2PrismaticJoint_GetLowerLimit_0=function(){return (dj=a._emscripten_bind_b2PrismaticJoint_GetLowerLimit_0=a.asm._g).apply(null,
arguments)},ej=a._emscripten_bind_b2PrismaticJoint_GetUpperLimit_0=function(){return (ej=a._emscripten_bind_b2PrismaticJoint_GetUpperLimit_0=a.asm.$g).apply(null,arguments)},fj=a._emscripten_bind_b2PrismaticJoint_SetLimits_2=function(){return (fj=a._emscripten_bind_b2PrismaticJoint_SetLimits_2=a.asm.ah).apply(null,arguments)},gj=a._emscripten_bind_b2PrismaticJoint_IsMotorEnabled_0=function(){return (gj=a._emscripten_bind_b2PrismaticJoint_IsMotorEnabled_0=a.asm.bh).apply(null,arguments)},hj=a._emscripten_bind_b2PrismaticJoint_EnableMotor_1=
function(){return (hj=a._emscripten_bind_b2PrismaticJoint_EnableMotor_1=a.asm.ch).apply(null,arguments)},ij=a._emscripten_bind_b2PrismaticJoint_SetMotorSpeed_1=function(){return (ij=a._emscripten_bind_b2PrismaticJoint_SetMotorSpeed_1=a.asm.dh).apply(null,arguments)},jj=a._emscripten_bind_b2PrismaticJoint_GetMotorSpeed_0=function(){return (jj=a._emscripten_bind_b2PrismaticJoint_GetMotorSpeed_0=a.asm.eh).apply(null,arguments)},kj=a._emscripten_bind_b2PrismaticJoint_SetMaxMotorForce_1=function(){return (kj=
a._emscripten_bind_b2PrismaticJoint_SetMaxMotorForce_1=a.asm.fh).apply(null,arguments)},lj=a._emscripten_bind_b2PrismaticJoint_GetMaxMotorForce_0=function(){return (lj=a._emscripten_bind_b2PrismaticJoint_GetMaxMotorForce_0=a.asm.gh).apply(null,arguments)},mj=a._emscripten_bind_b2PrismaticJoint_GetMotorForce_1=function(){return (mj=a._emscripten_bind_b2PrismaticJoint_GetMotorForce_1=a.asm.hh).apply(null,arguments)},nj=a._emscripten_bind_b2PrismaticJoint_GetType_0=function(){return (nj=a._emscripten_bind_b2PrismaticJoint_GetType_0=
a.asm.ih).apply(null,arguments)},oj=a._emscripten_bind_b2PrismaticJoint_GetBodyA_0=function(){return (oj=a._emscripten_bind_b2PrismaticJoint_GetBodyA_0=a.asm.jh).apply(null,arguments)},pj=a._emscripten_bind_b2PrismaticJoint_GetBodyB_0=function(){return (pj=a._emscripten_bind_b2PrismaticJoint_GetBodyB_0=a.asm.kh).apply(null,arguments)},qj=a._emscripten_bind_b2PrismaticJoint_GetAnchorA_0=function(){return (qj=a._emscripten_bind_b2PrismaticJoint_GetAnchorA_0=a.asm.lh).apply(null,arguments)},rj=a._emscripten_bind_b2PrismaticJoint_GetAnchorB_0=
function(){return (rj=a._emscripten_bind_b2PrismaticJoint_GetAnchorB_0=a.asm.mh).apply(null,arguments)},sj=a._emscripten_bind_b2PrismaticJoint_GetReactionForce_1=function(){return (sj=a._emscripten_bind_b2PrismaticJoint_GetReactionForce_1=a.asm.nh).apply(null,arguments)},tj=a._emscripten_bind_b2PrismaticJoint_GetReactionTorque_1=function(){return (tj=a._emscripten_bind_b2PrismaticJoint_GetReactionTorque_1=a.asm.oh).apply(null,arguments)},uj=a._emscripten_bind_b2PrismaticJoint_GetNext_0=function(){return (uj=
a._emscripten_bind_b2PrismaticJoint_GetNext_0=a.asm.ph).apply(null,arguments)},vj=a._emscripten_bind_b2PrismaticJoint_GetUserData_0=function(){return (vj=a._emscripten_bind_b2PrismaticJoint_GetUserData_0=a.asm.qh).apply(null,arguments)},wj=a._emscripten_bind_b2PrismaticJoint_SetUserData_1=function(){return (wj=a._emscripten_bind_b2PrismaticJoint_SetUserData_1=a.asm.rh).apply(null,arguments)},xj=a._emscripten_bind_b2PrismaticJoint_IsActive_0=function(){return (xj=a._emscripten_bind_b2PrismaticJoint_IsActive_0=
a.asm.sh).apply(null,arguments)},yj=a._emscripten_bind_b2PrismaticJoint_GetCollideConnected_0=function(){return (yj=a._emscripten_bind_b2PrismaticJoint_GetCollideConnected_0=a.asm.th).apply(null,arguments)},zj=a._emscripten_bind_b2PrismaticJoint___destroy___0=function(){return (zj=a._emscripten_bind_b2PrismaticJoint___destroy___0=a.asm.uh).apply(null,arguments)},Aj=a._emscripten_bind_b2RayCastOutput_get_normal_0=function(){return (Aj=a._emscripten_bind_b2RayCastOutput_get_normal_0=a.asm.vh).apply(null,
arguments)},Bj=a._emscripten_bind_b2RayCastOutput_set_normal_1=function(){return (Bj=a._emscripten_bind_b2RayCastOutput_set_normal_1=a.asm.wh).apply(null,arguments)},Cj=a._emscripten_bind_b2RayCastOutput_get_fraction_0=function(){return (Cj=a._emscripten_bind_b2RayCastOutput_get_fraction_0=a.asm.xh).apply(null,arguments)},Dj=a._emscripten_bind_b2RayCastOutput_set_fraction_1=function(){return (Dj=a._emscripten_bind_b2RayCastOutput_set_fraction_1=a.asm.yh).apply(null,arguments)},Ej=a._emscripten_bind_b2RayCastOutput___destroy___0=
function(){return (Ej=a._emscripten_bind_b2RayCastOutput___destroy___0=a.asm.zh).apply(null,arguments)},Fj=a._emscripten_bind_b2ContactID_get_cf_0=function(){return (Fj=a._emscripten_bind_b2ContactID_get_cf_0=a.asm.Ah).apply(null,arguments)},Gj=a._emscripten_bind_b2ContactID_set_cf_1=function(){return (Gj=a._emscripten_bind_b2ContactID_set_cf_1=a.asm.Bh).apply(null,arguments)},Hj=a._emscripten_bind_b2ContactID_get_key_0=function(){return (Hj=a._emscripten_bind_b2ContactID_get_key_0=a.asm.Ch).apply(null,
arguments)},Ij=a._emscripten_bind_b2ContactID_set_key_1=function(){return (Ij=a._emscripten_bind_b2ContactID_set_key_1=a.asm.Dh).apply(null,arguments)},Jj=a._emscripten_bind_b2ContactID___destroy___0=function(){return (Jj=a._emscripten_bind_b2ContactID___destroy___0=a.asm.Eh).apply(null,arguments)},Kj=a._emscripten_bind_JSContactListener_JSContactListener_0=function(){return (Kj=a._emscripten_bind_JSContactListener_JSContactListener_0=a.asm.Fh).apply(null,arguments)},Lj=a._emscripten_bind_JSContactListener_BeginContact_1=
function(){return (Lj=a._emscripten_bind_JSContactListener_BeginContact_1=a.asm.Gh).apply(null,arguments)},Mj=a._emscripten_bind_JSContactListener_EndContact_1=function(){return (Mj=a._emscripten_bind_JSContactListener_EndContact_1=a.asm.Hh).apply(null,arguments)},Nj=a._emscripten_bind_JSContactListener_PreSolve_2=function(){return (Nj=a._emscripten_bind_JSContactListener_PreSolve_2=a.asm.Ih).apply(null,arguments)},Oj=a._emscripten_bind_JSContactListener_PostSolve_2=function(){return (Oj=a._emscripten_bind_JSContactListener_PostSolve_2=
a.asm.Jh).apply(null,arguments)},Pj=a._emscripten_bind_JSContactListener___destroy___0=function(){return (Pj=a._emscripten_bind_JSContactListener___destroy___0=a.asm.Kh).apply(null,arguments)},Qj=a._emscripten_bind_b2Mat22_b2Mat22_0=function(){return (Qj=a._emscripten_bind_b2Mat22_b2Mat22_0=a.asm.Lh).apply(null,arguments)},Rj=a._emscripten_bind_b2Mat22_b2Mat22_2=function(){return (Rj=a._emscripten_bind_b2Mat22_b2Mat22_2=a.asm.Mh).apply(null,arguments)},Sj=a._emscripten_bind_b2Mat22_b2Mat22_4=function(){return (Sj=
a._emscripten_bind_b2Mat22_b2Mat22_4=a.asm.Nh).apply(null,arguments)},Tj=a._emscripten_bind_b2Mat22_Set_2=function(){return (Tj=a._emscripten_bind_b2Mat22_Set_2=a.asm.Oh).apply(null,arguments)},Uj=a._emscripten_bind_b2Mat22_SetIdentity_0=function(){return (Uj=a._emscripten_bind_b2Mat22_SetIdentity_0=a.asm.Ph).apply(null,arguments)},Vj=a._emscripten_bind_b2Mat22_SetZero_0=function(){return (Vj=a._emscripten_bind_b2Mat22_SetZero_0=a.asm.Qh).apply(null,arguments)},Wj=a._emscripten_bind_b2Mat22_GetInverse_0=
function(){return (Wj=a._emscripten_bind_b2Mat22_GetInverse_0=a.asm.Rh).apply(null,arguments)},Xj=a._emscripten_bind_b2Mat22_Solve_1=function(){return (Xj=a._emscripten_bind_b2Mat22_Solve_1=a.asm.Sh).apply(null,arguments)},Yj=a._emscripten_bind_b2Mat22_get_ex_0=function(){return (Yj=a._emscripten_bind_b2Mat22_get_ex_0=a.asm.Th).apply(null,arguments)},Zj=a._emscripten_bind_b2Mat22_set_ex_1=function(){return (Zj=a._emscripten_bind_b2Mat22_set_ex_1=a.asm.Uh).apply(null,arguments)},ak=a._emscripten_bind_b2Mat22_get_ey_0=
function(){return (ak=a._emscripten_bind_b2Mat22_get_ey_0=a.asm.Vh).apply(null,arguments)},bk=a._emscripten_bind_b2Mat22_set_ey_1=function(){return (bk=a._emscripten_bind_b2Mat22_set_ey_1=a.asm.Wh).apply(null,arguments)},ck=a._emscripten_bind_b2Mat22___destroy___0=function(){return (ck=a._emscripten_bind_b2Mat22___destroy___0=a.asm.Xh).apply(null,arguments)},dk=a._emscripten_bind_b2WheelJointDef_b2WheelJointDef_0=function(){return (dk=a._emscripten_bind_b2WheelJointDef_b2WheelJointDef_0=a.asm.Yh).apply(null,
arguments)},ek=a._emscripten_bind_b2WheelJointDef_Initialize_4=function(){return (ek=a._emscripten_bind_b2WheelJointDef_Initialize_4=a.asm.Zh).apply(null,arguments)},fk=a._emscripten_bind_b2WheelJointDef_get_localAnchorA_0=function(){return (fk=a._emscripten_bind_b2WheelJointDef_get_localAnchorA_0=a.asm._h).apply(null,arguments)},gk=a._emscripten_bind_b2WheelJointDef_set_localAnchorA_1=function(){return (gk=a._emscripten_bind_b2WheelJointDef_set_localAnchorA_1=a.asm.$h).apply(null,arguments)},hk=a._emscripten_bind_b2WheelJointDef_get_localAnchorB_0=
function(){return (hk=a._emscripten_bind_b2WheelJointDef_get_localAnchorB_0=a.asm.ai).apply(null,arguments)},ik=a._emscripten_bind_b2WheelJointDef_set_localAnchorB_1=function(){return (ik=a._emscripten_bind_b2WheelJointDef_set_localAnchorB_1=a.asm.bi).apply(null,arguments)},jk=a._emscripten_bind_b2WheelJointDef_get_localAxisA_0=function(){return (jk=a._emscripten_bind_b2WheelJointDef_get_localAxisA_0=a.asm.ci).apply(null,arguments)},kk=a._emscripten_bind_b2WheelJointDef_set_localAxisA_1=function(){return (kk=
a._emscripten_bind_b2WheelJointDef_set_localAxisA_1=a.asm.di).apply(null,arguments)},lk=a._emscripten_bind_b2WheelJointDef_get_enableMotor_0=function(){return (lk=a._emscripten_bind_b2WheelJointDef_get_enableMotor_0=a.asm.ei).apply(null,arguments)},mk=a._emscripten_bind_b2WheelJointDef_set_enableMotor_1=function(){return (mk=a._emscripten_bind_b2WheelJointDef_set_enableMotor_1=a.asm.fi).apply(null,arguments)},nk=a._emscripten_bind_b2WheelJointDef_get_maxMotorTorque_0=function(){return (nk=a._emscripten_bind_b2WheelJointDef_get_maxMotorTorque_0=
a.asm.gi).apply(null,arguments)},ok=a._emscripten_bind_b2WheelJointDef_set_maxMotorTorque_1=function(){return (ok=a._emscripten_bind_b2WheelJointDef_set_maxMotorTorque_1=a.asm.hi).apply(null,arguments)},pk=a._emscripten_bind_b2WheelJointDef_get_motorSpeed_0=function(){return (pk=a._emscripten_bind_b2WheelJointDef_get_motorSpeed_0=a.asm.ii).apply(null,arguments)},qk=a._emscripten_bind_b2WheelJointDef_set_motorSpeed_1=function(){return (qk=a._emscripten_bind_b2WheelJointDef_set_motorSpeed_1=a.asm.ji).apply(null,
arguments)},rk=a._emscripten_bind_b2WheelJointDef_get_frequencyHz_0=function(){return (rk=a._emscripten_bind_b2WheelJointDef_get_frequencyHz_0=a.asm.ki).apply(null,arguments)},sk=a._emscripten_bind_b2WheelJointDef_set_frequencyHz_1=function(){return (sk=a._emscripten_bind_b2WheelJointDef_set_frequencyHz_1=a.asm.li).apply(null,arguments)},tk=a._emscripten_bind_b2WheelJointDef_get_dampingRatio_0=function(){return (tk=a._emscripten_bind_b2WheelJointDef_get_dampingRatio_0=a.asm.mi).apply(null,arguments)},
uk=a._emscripten_bind_b2WheelJointDef_set_dampingRatio_1=function(){return (uk=a._emscripten_bind_b2WheelJointDef_set_dampingRatio_1=a.asm.ni).apply(null,arguments)},vk=a._emscripten_bind_b2WheelJointDef_get_type_0=function(){return (vk=a._emscripten_bind_b2WheelJointDef_get_type_0=a.asm.oi).apply(null,arguments)},wk=a._emscripten_bind_b2WheelJointDef_set_type_1=function(){return (wk=a._emscripten_bind_b2WheelJointDef_set_type_1=a.asm.pi).apply(null,arguments)},xk=a._emscripten_bind_b2WheelJointDef_get_userData_0=
function(){return (xk=a._emscripten_bind_b2WheelJointDef_get_userData_0=a.asm.qi).apply(null,arguments)},yk=a._emscripten_bind_b2WheelJointDef_set_userData_1=function(){return (yk=a._emscripten_bind_b2WheelJointDef_set_userData_1=a.asm.ri).apply(null,arguments)},zk=a._emscripten_bind_b2WheelJointDef_get_bodyA_0=function(){return (zk=a._emscripten_bind_b2WheelJointDef_get_bodyA_0=a.asm.si).apply(null,arguments)},Ak=a._emscripten_bind_b2WheelJointDef_set_bodyA_1=function(){return (Ak=a._emscripten_bind_b2WheelJointDef_set_bodyA_1=
a.asm.ti).apply(null,arguments)},Bk=a._emscripten_bind_b2WheelJointDef_get_bodyB_0=function(){return (Bk=a._emscripten_bind_b2WheelJointDef_get_bodyB_0=a.asm.ui).apply(null,arguments)},Ck=a._emscripten_bind_b2WheelJointDef_set_bodyB_1=function(){return (Ck=a._emscripten_bind_b2WheelJointDef_set_bodyB_1=a.asm.vi).apply(null,arguments)},Dk=a._emscripten_bind_b2WheelJointDef_get_collideConnected_0=function(){return (Dk=a._emscripten_bind_b2WheelJointDef_get_collideConnected_0=a.asm.wi).apply(null,arguments)},
Ek=a._emscripten_bind_b2WheelJointDef_set_collideConnected_1=function(){return (Ek=a._emscripten_bind_b2WheelJointDef_set_collideConnected_1=a.asm.xi).apply(null,arguments)},Fk=a._emscripten_bind_b2WheelJointDef___destroy___0=function(){return (Fk=a._emscripten_bind_b2WheelJointDef___destroy___0=a.asm.yi).apply(null,arguments)},Gk=a._emscripten_bind_b2CircleShape_b2CircleShape_0=function(){return (Gk=a._emscripten_bind_b2CircleShape_b2CircleShape_0=a.asm.zi).apply(null,arguments)},Hk=a._emscripten_bind_b2CircleShape_GetType_0=
function(){return (Hk=a._emscripten_bind_b2CircleShape_GetType_0=a.asm.Ai).apply(null,arguments)},Ik=a._emscripten_bind_b2CircleShape_GetChildCount_0=function(){return (Ik=a._emscripten_bind_b2CircleShape_GetChildCount_0=a.asm.Bi).apply(null,arguments)},Jk=a._emscripten_bind_b2CircleShape_TestPoint_2=function(){return (Jk=a._emscripten_bind_b2CircleShape_TestPoint_2=a.asm.Ci).apply(null,arguments)},Kk=a._emscripten_bind_b2CircleShape_RayCast_4=function(){return (Kk=a._emscripten_bind_b2CircleShape_RayCast_4=
a.asm.Di).apply(null,arguments)},Lk=a._emscripten_bind_b2CircleShape_ComputeAABB_3=function(){return (Lk=a._emscripten_bind_b2CircleShape_ComputeAABB_3=a.asm.Ei).apply(null,arguments)},Mk=a._emscripten_bind_b2CircleShape_ComputeMass_2=function(){return (Mk=a._emscripten_bind_b2CircleShape_ComputeMass_2=a.asm.Fi).apply(null,arguments)},Nk=a._emscripten_bind_b2CircleShape_get_m_p_0=function(){return (Nk=a._emscripten_bind_b2CircleShape_get_m_p_0=a.asm.Gi).apply(null,arguments)},Ok=a._emscripten_bind_b2CircleShape_set_m_p_1=
function(){return (Ok=a._emscripten_bind_b2CircleShape_set_m_p_1=a.asm.Hi).apply(null,arguments)},Pk=a._emscripten_bind_b2CircleShape_get_m_type_0=function(){return (Pk=a._emscripten_bind_b2CircleShape_get_m_type_0=a.asm.Ii).apply(null,arguments)},Qk=a._emscripten_bind_b2CircleShape_set_m_type_1=function(){return (Qk=a._emscripten_bind_b2CircleShape_set_m_type_1=a.asm.Ji).apply(null,arguments)},Rk=a._emscripten_bind_b2CircleShape_get_m_radius_0=function(){return (Rk=a._emscripten_bind_b2CircleShape_get_m_radius_0=
a.asm.Ki).apply(null,arguments)},Sk=a._emscripten_bind_b2CircleShape_set_m_radius_1=function(){return (Sk=a._emscripten_bind_b2CircleShape_set_m_radius_1=a.asm.Li).apply(null,arguments)},Tk=a._emscripten_bind_b2CircleShape___destroy___0=function(){return (Tk=a._emscripten_bind_b2CircleShape___destroy___0=a.asm.Mi).apply(null,arguments)},Uk=a._emscripten_bind_b2WeldJointDef_b2WeldJointDef_0=function(){return (Uk=a._emscripten_bind_b2WeldJointDef_b2WeldJointDef_0=a.asm.Ni).apply(null,arguments)},Vk=a._emscripten_bind_b2WeldJointDef_Initialize_3=
function(){return (Vk=a._emscripten_bind_b2WeldJointDef_Initialize_3=a.asm.Oi).apply(null,arguments)},Wk=a._emscripten_bind_b2WeldJointDef_get_localAnchorA_0=function(){return (Wk=a._emscripten_bind_b2WeldJointDef_get_localAnchorA_0=a.asm.Pi).apply(null,arguments)},Xk=a._emscripten_bind_b2WeldJointDef_set_localAnchorA_1=function(){return (Xk=a._emscripten_bind_b2WeldJointDef_set_localAnchorA_1=a.asm.Qi).apply(null,arguments)},Yk=a._emscripten_bind_b2WeldJointDef_get_localAnchorB_0=function(){return (Yk=
a._emscripten_bind_b2WeldJointDef_get_localAnchorB_0=a.asm.Ri).apply(null,arguments)},Zk=a._emscripten_bind_b2WeldJointDef_set_localAnchorB_1=function(){return (Zk=a._emscripten_bind_b2WeldJointDef_set_localAnchorB_1=a.asm.Si).apply(null,arguments)},$k=a._emscripten_bind_b2WeldJointDef_get_referenceAngle_0=function(){return ($k=a._emscripten_bind_b2WeldJointDef_get_referenceAngle_0=a.asm.Ti).apply(null,arguments)},al=a._emscripten_bind_b2WeldJointDef_set_referenceAngle_1=function(){return (al=a._emscripten_bind_b2WeldJointDef_set_referenceAngle_1=
a.asm.Ui).apply(null,arguments)},bl=a._emscripten_bind_b2WeldJointDef_get_frequencyHz_0=function(){return (bl=a._emscripten_bind_b2WeldJointDef_get_frequencyHz_0=a.asm.Vi).apply(null,arguments)},cl=a._emscripten_bind_b2WeldJointDef_set_frequencyHz_1=function(){return (cl=a._emscripten_bind_b2WeldJointDef_set_frequencyHz_1=a.asm.Wi).apply(null,arguments)},dl=a._emscripten_bind_b2WeldJointDef_get_dampingRatio_0=function(){return (dl=a._emscripten_bind_b2WeldJointDef_get_dampingRatio_0=a.asm.Xi).apply(null,
arguments)},el=a._emscripten_bind_b2WeldJointDef_set_dampingRatio_1=function(){return (el=a._emscripten_bind_b2WeldJointDef_set_dampingRatio_1=a.asm.Yi).apply(null,arguments)},fl=a._emscripten_bind_b2WeldJointDef_get_type_0=function(){return (fl=a._emscripten_bind_b2WeldJointDef_get_type_0=a.asm.Zi).apply(null,arguments)},gl=a._emscripten_bind_b2WeldJointDef_set_type_1=function(){return (gl=a._emscripten_bind_b2WeldJointDef_set_type_1=a.asm._i).apply(null,arguments)},hl=a._emscripten_bind_b2WeldJointDef_get_userData_0=
function(){return (hl=a._emscripten_bind_b2WeldJointDef_get_userData_0=a.asm.$i).apply(null,arguments)},il=a._emscripten_bind_b2WeldJointDef_set_userData_1=function(){return (il=a._emscripten_bind_b2WeldJointDef_set_userData_1=a.asm.aj).apply(null,arguments)},jl=a._emscripten_bind_b2WeldJointDef_get_bodyA_0=function(){return (jl=a._emscripten_bind_b2WeldJointDef_get_bodyA_0=a.asm.bj).apply(null,arguments)},kl=a._emscripten_bind_b2WeldJointDef_set_bodyA_1=function(){return (kl=a._emscripten_bind_b2WeldJointDef_set_bodyA_1=
a.asm.cj).apply(null,arguments)},ll=a._emscripten_bind_b2WeldJointDef_get_bodyB_0=function(){return (ll=a._emscripten_bind_b2WeldJointDef_get_bodyB_0=a.asm.dj).apply(null,arguments)},ml=a._emscripten_bind_b2WeldJointDef_set_bodyB_1=function(){return (ml=a._emscripten_bind_b2WeldJointDef_set_bodyB_1=a.asm.ej).apply(null,arguments)},nl=a._emscripten_bind_b2WeldJointDef_get_collideConnected_0=function(){return (nl=a._emscripten_bind_b2WeldJointDef_get_collideConnected_0=a.asm.fj).apply(null,arguments)},
ol=a._emscripten_bind_b2WeldJointDef_set_collideConnected_1=function(){return (ol=a._emscripten_bind_b2WeldJointDef_set_collideConnected_1=a.asm.gj).apply(null,arguments)},pl=a._emscripten_bind_b2WeldJointDef___destroy___0=function(){return (pl=a._emscripten_bind_b2WeldJointDef___destroy___0=a.asm.hj).apply(null,arguments)},ql=a._emscripten_bind_b2MassData_b2MassData_0=function(){return (ql=a._emscripten_bind_b2MassData_b2MassData_0=a.asm.ij).apply(null,arguments)},rl=a._emscripten_bind_b2MassData_get_mass_0=
function(){return (rl=a._emscripten_bind_b2MassData_get_mass_0=a.asm.jj).apply(null,arguments)},sl=a._emscripten_bind_b2MassData_set_mass_1=function(){return (sl=a._emscripten_bind_b2MassData_set_mass_1=a.asm.kj).apply(null,arguments)},tl=a._emscripten_bind_b2MassData_get_center_0=function(){return (tl=a._emscripten_bind_b2MassData_get_center_0=a.asm.lj).apply(null,arguments)},ul=a._emscripten_bind_b2MassData_set_center_1=function(){return (ul=a._emscripten_bind_b2MassData_set_center_1=a.asm.mj).apply(null,
arguments)},vl=a._emscripten_bind_b2MassData_get_I_0=function(){return (vl=a._emscripten_bind_b2MassData_get_I_0=a.asm.nj).apply(null,arguments)},wl=a._emscripten_bind_b2MassData_set_I_1=function(){return (wl=a._emscripten_bind_b2MassData_set_I_1=a.asm.oj).apply(null,arguments)},xl=a._emscripten_bind_b2MassData___destroy___0=function(){return (xl=a._emscripten_bind_b2MassData___destroy___0=a.asm.pj).apply(null,arguments)},yl=a._emscripten_bind_b2GearJoint_GetJoint1_0=function(){return (yl=a._emscripten_bind_b2GearJoint_GetJoint1_0=
a.asm.qj).apply(null,arguments)},zl=a._emscripten_bind_b2GearJoint_GetJoint2_0=function(){return (zl=a._emscripten_bind_b2GearJoint_GetJoint2_0=a.asm.rj).apply(null,arguments)},Al=a._emscripten_bind_b2GearJoint_SetRatio_1=function(){return (Al=a._emscripten_bind_b2GearJoint_SetRatio_1=a.asm.sj).apply(null,arguments)},Bl=a._emscripten_bind_b2GearJoint_GetRatio_0=function(){return (Bl=a._emscripten_bind_b2GearJoint_GetRatio_0=a.asm.tj).apply(null,arguments)},Cl=a._emscripten_bind_b2GearJoint_GetType_0=
function(){return (Cl=a._emscripten_bind_b2GearJoint_GetType_0=a.asm.uj).apply(null,arguments)},Dl=a._emscripten_bind_b2GearJoint_GetBodyA_0=function(){return (Dl=a._emscripten_bind_b2GearJoint_GetBodyA_0=a.asm.vj).apply(null,arguments)},El=a._emscripten_bind_b2GearJoint_GetBodyB_0=function(){return (El=a._emscripten_bind_b2GearJoint_GetBodyB_0=a.asm.wj).apply(null,arguments)},Fl=a._emscripten_bind_b2GearJoint_GetAnchorA_0=function(){return (Fl=a._emscripten_bind_b2GearJoint_GetAnchorA_0=a.asm.xj).apply(null,
arguments)},Gl=a._emscripten_bind_b2GearJoint_GetAnchorB_0=function(){return (Gl=a._emscripten_bind_b2GearJoint_GetAnchorB_0=a.asm.yj).apply(null,arguments)},Hl=a._emscripten_bind_b2GearJoint_GetReactionForce_1=function(){return (Hl=a._emscripten_bind_b2GearJoint_GetReactionForce_1=a.asm.zj).apply(null,arguments)},Il=a._emscripten_bind_b2GearJoint_GetReactionTorque_1=function(){return (Il=a._emscripten_bind_b2GearJoint_GetReactionTorque_1=a.asm.Aj).apply(null,arguments)},Jl=a._emscripten_bind_b2GearJoint_GetNext_0=
function(){return (Jl=a._emscripten_bind_b2GearJoint_GetNext_0=a.asm.Bj).apply(null,arguments)},Kl=a._emscripten_bind_b2GearJoint_GetUserData_0=function(){return (Kl=a._emscripten_bind_b2GearJoint_GetUserData_0=a.asm.Cj).apply(null,arguments)},Ll=a._emscripten_bind_b2GearJoint_SetUserData_1=function(){return (Ll=a._emscripten_bind_b2GearJoint_SetUserData_1=a.asm.Dj).apply(null,arguments)},Ml=a._emscripten_bind_b2GearJoint_IsActive_0=function(){return (Ml=a._emscripten_bind_b2GearJoint_IsActive_0=a.asm.Ej).apply(null,
arguments)},Nl=a._emscripten_bind_b2GearJoint_GetCollideConnected_0=function(){return (Nl=a._emscripten_bind_b2GearJoint_GetCollideConnected_0=a.asm.Fj).apply(null,arguments)},Ol=a._emscripten_bind_b2GearJoint___destroy___0=function(){return (Ol=a._emscripten_bind_b2GearJoint___destroy___0=a.asm.Gj).apply(null,arguments)},Pl=a._emscripten_bind_b2WeldJoint_GetLocalAnchorA_0=function(){return (Pl=a._emscripten_bind_b2WeldJoint_GetLocalAnchorA_0=a.asm.Hj).apply(null,arguments)},Ql=a._emscripten_bind_b2WeldJoint_GetLocalAnchorB_0=
function(){return (Ql=a._emscripten_bind_b2WeldJoint_GetLocalAnchorB_0=a.asm.Ij).apply(null,arguments)},Rl=a._emscripten_bind_b2WeldJoint_SetFrequency_1=function(){return (Rl=a._emscripten_bind_b2WeldJoint_SetFrequency_1=a.asm.Jj).apply(null,arguments)},Sl=a._emscripten_bind_b2WeldJoint_GetFrequency_0=function(){return (Sl=a._emscripten_bind_b2WeldJoint_GetFrequency_0=a.asm.Kj).apply(null,arguments)},Tl=a._emscripten_bind_b2WeldJoint_SetDampingRatio_1=function(){return (Tl=a._emscripten_bind_b2WeldJoint_SetDampingRatio_1=
a.asm.Lj).apply(null,arguments)},Ul=a._emscripten_bind_b2WeldJoint_GetDampingRatio_0=function(){return (Ul=a._emscripten_bind_b2WeldJoint_GetDampingRatio_0=a.asm.Mj).apply(null,arguments)},Vl=a._emscripten_bind_b2WeldJoint_Dump_0=function(){return (Vl=a._emscripten_bind_b2WeldJoint_Dump_0=a.asm.Nj).apply(null,arguments)},Wl=a._emscripten_bind_b2WeldJoint_GetType_0=function(){return (Wl=a._emscripten_bind_b2WeldJoint_GetType_0=a.asm.Oj).apply(null,arguments)},Xl=a._emscripten_bind_b2WeldJoint_GetBodyA_0=
function(){return (Xl=a._emscripten_bind_b2WeldJoint_GetBodyA_0=a.asm.Pj).apply(null,arguments)},Yl=a._emscripten_bind_b2WeldJoint_GetBodyB_0=function(){return (Yl=a._emscripten_bind_b2WeldJoint_GetBodyB_0=a.asm.Qj).apply(null,arguments)},Zl=a._emscripten_bind_b2WeldJoint_GetAnchorA_0=function(){return (Zl=a._emscripten_bind_b2WeldJoint_GetAnchorA_0=a.asm.Rj).apply(null,arguments)},$l=a._emscripten_bind_b2WeldJoint_GetAnchorB_0=function(){return ($l=a._emscripten_bind_b2WeldJoint_GetAnchorB_0=a.asm.Sj).apply(null,
arguments)},am=a._emscripten_bind_b2WeldJoint_GetReactionForce_1=function(){return (am=a._emscripten_bind_b2WeldJoint_GetReactionForce_1=a.asm.Tj).apply(null,arguments)},bm=a._emscripten_bind_b2WeldJoint_GetReactionTorque_1=function(){return (bm=a._emscripten_bind_b2WeldJoint_GetReactionTorque_1=a.asm.Uj).apply(null,arguments)},cm=a._emscripten_bind_b2WeldJoint_GetNext_0=function(){return (cm=a._emscripten_bind_b2WeldJoint_GetNext_0=a.asm.Vj).apply(null,arguments)},dm=a._emscripten_bind_b2WeldJoint_GetUserData_0=
function(){return (dm=a._emscripten_bind_b2WeldJoint_GetUserData_0=a.asm.Wj).apply(null,arguments)},em=a._emscripten_bind_b2WeldJoint_SetUserData_1=function(){return (em=a._emscripten_bind_b2WeldJoint_SetUserData_1=a.asm.Xj).apply(null,arguments)},fm=a._emscripten_bind_b2WeldJoint_IsActive_0=function(){return (fm=a._emscripten_bind_b2WeldJoint_IsActive_0=a.asm.Yj).apply(null,arguments)},gm=a._emscripten_bind_b2WeldJoint_GetCollideConnected_0=function(){return (gm=a._emscripten_bind_b2WeldJoint_GetCollideConnected_0=
a.asm.Zj).apply(null,arguments)},hm=a._emscripten_bind_b2WeldJoint___destroy___0=function(){return (hm=a._emscripten_bind_b2WeldJoint___destroy___0=a.asm._j).apply(null,arguments)},im=a._emscripten_bind_b2JointEdge_b2JointEdge_0=function(){return (im=a._emscripten_bind_b2JointEdge_b2JointEdge_0=a.asm.$j).apply(null,arguments)},jm=a._emscripten_bind_b2JointEdge_get_other_0=function(){return (jm=a._emscripten_bind_b2JointEdge_get_other_0=a.asm.ak).apply(null,arguments)},km=a._emscripten_bind_b2JointEdge_set_other_1=
function(){return (km=a._emscripten_bind_b2JointEdge_set_other_1=a.asm.bk).apply(null,arguments)},lm=a._emscripten_bind_b2JointEdge_get_joint_0=function(){return (lm=a._emscripten_bind_b2JointEdge_get_joint_0=a.asm.ck).apply(null,arguments)},mm=a._emscripten_bind_b2JointEdge_set_joint_1=function(){return (mm=a._emscripten_bind_b2JointEdge_set_joint_1=a.asm.dk).apply(null,arguments)},nm=a._emscripten_bind_b2JointEdge_get_prev_0=function(){return (nm=a._emscripten_bind_b2JointEdge_get_prev_0=a.asm.ek).apply(null,
arguments)},om=a._emscripten_bind_b2JointEdge_set_prev_1=function(){return (om=a._emscripten_bind_b2JointEdge_set_prev_1=a.asm.fk).apply(null,arguments)},pm=a._emscripten_bind_b2JointEdge_get_next_0=function(){return (pm=a._emscripten_bind_b2JointEdge_get_next_0=a.asm.gk).apply(null,arguments)},qm=a._emscripten_bind_b2JointEdge_set_next_1=function(){return (qm=a._emscripten_bind_b2JointEdge_set_next_1=a.asm.hk).apply(null,arguments)},rm=a._emscripten_bind_b2JointEdge___destroy___0=function(){return (rm=
a._emscripten_bind_b2JointEdge___destroy___0=a.asm.ik).apply(null,arguments)},sm=a._emscripten_bind_b2PulleyJointDef_b2PulleyJointDef_0=function(){return (sm=a._emscripten_bind_b2PulleyJointDef_b2PulleyJointDef_0=a.asm.jk).apply(null,arguments)},tm=a._emscripten_bind_b2PulleyJointDef_Initialize_7=function(){return (tm=a._emscripten_bind_b2PulleyJointDef_Initialize_7=a.asm.kk).apply(null,arguments)},um=a._emscripten_bind_b2PulleyJointDef_get_groundAnchorA_0=function(){return (um=a._emscripten_bind_b2PulleyJointDef_get_groundAnchorA_0=
a.asm.lk).apply(null,arguments)},wm=a._emscripten_bind_b2PulleyJointDef_set_groundAnchorA_1=function(){return (wm=a._emscripten_bind_b2PulleyJointDef_set_groundAnchorA_1=a.asm.mk).apply(null,arguments)},xm=a._emscripten_bind_b2PulleyJointDef_get_groundAnchorB_0=function(){return (xm=a._emscripten_bind_b2PulleyJointDef_get_groundAnchorB_0=a.asm.nk).apply(null,arguments)},ym=a._emscripten_bind_b2PulleyJointDef_set_groundAnchorB_1=function(){return (ym=a._emscripten_bind_b2PulleyJointDef_set_groundAnchorB_1=
a.asm.ok).apply(null,arguments)},zm=a._emscripten_bind_b2PulleyJointDef_get_localAnchorA_0=function(){return (zm=a._emscripten_bind_b2PulleyJointDef_get_localAnchorA_0=a.asm.pk).apply(null,arguments)},Am=a._emscripten_bind_b2PulleyJointDef_set_localAnchorA_1=function(){return (Am=a._emscripten_bind_b2PulleyJointDef_set_localAnchorA_1=a.asm.qk).apply(null,arguments)},Bm=a._emscripten_bind_b2PulleyJointDef_get_localAnchorB_0=function(){return (Bm=a._emscripten_bind_b2PulleyJointDef_get_localAnchorB_0=
a.asm.rk).apply(null,arguments)},Cm=a._emscripten_bind_b2PulleyJointDef_set_localAnchorB_1=function(){return (Cm=a._emscripten_bind_b2PulleyJointDef_set_localAnchorB_1=a.asm.sk).apply(null,arguments)},Dm=a._emscripten_bind_b2PulleyJointDef_get_lengthA_0=function(){return (Dm=a._emscripten_bind_b2PulleyJointDef_get_lengthA_0=a.asm.tk).apply(null,arguments)},Em=a._emscripten_bind_b2PulleyJointDef_set_lengthA_1=function(){return (Em=a._emscripten_bind_b2PulleyJointDef_set_lengthA_1=a.asm.uk).apply(null,
arguments)},Fm=a._emscripten_bind_b2PulleyJointDef_get_lengthB_0=function(){return (Fm=a._emscripten_bind_b2PulleyJointDef_get_lengthB_0=a.asm.vk).apply(null,arguments)},Gm=a._emscripten_bind_b2PulleyJointDef_set_lengthB_1=function(){return (Gm=a._emscripten_bind_b2PulleyJointDef_set_lengthB_1=a.asm.wk).apply(null,arguments)},Hm=a._emscripten_bind_b2PulleyJointDef_get_ratio_0=function(){return (Hm=a._emscripten_bind_b2PulleyJointDef_get_ratio_0=a.asm.xk).apply(null,arguments)},Im=a._emscripten_bind_b2PulleyJointDef_set_ratio_1=
function(){return (Im=a._emscripten_bind_b2PulleyJointDef_set_ratio_1=a.asm.yk).apply(null,arguments)},Jm=a._emscripten_bind_b2PulleyJointDef_get_type_0=function(){return (Jm=a._emscripten_bind_b2PulleyJointDef_get_type_0=a.asm.zk).apply(null,arguments)},Km=a._emscripten_bind_b2PulleyJointDef_set_type_1=function(){return (Km=a._emscripten_bind_b2PulleyJointDef_set_type_1=a.asm.Ak).apply(null,arguments)},Lm=a._emscripten_bind_b2PulleyJointDef_get_userData_0=function(){return (Lm=a._emscripten_bind_b2PulleyJointDef_get_userData_0=
a.asm.Bk).apply(null,arguments)},Mm=a._emscripten_bind_b2PulleyJointDef_set_userData_1=function(){return (Mm=a._emscripten_bind_b2PulleyJointDef_set_userData_1=a.asm.Ck).apply(null,arguments)},Nm=a._emscripten_bind_b2PulleyJointDef_get_bodyA_0=function(){return (Nm=a._emscripten_bind_b2PulleyJointDef_get_bodyA_0=a.asm.Dk).apply(null,arguments)},Om=a._emscripten_bind_b2PulleyJointDef_set_bodyA_1=function(){return (Om=a._emscripten_bind_b2PulleyJointDef_set_bodyA_1=a.asm.Ek).apply(null,arguments)},Pm=
a._emscripten_bind_b2PulleyJointDef_get_bodyB_0=function(){return (Pm=a._emscripten_bind_b2PulleyJointDef_get_bodyB_0=a.asm.Fk).apply(null,arguments)},Qm=a._emscripten_bind_b2PulleyJointDef_set_bodyB_1=function(){return (Qm=a._emscripten_bind_b2PulleyJointDef_set_bodyB_1=a.asm.Gk).apply(null,arguments)},Rm=a._emscripten_bind_b2PulleyJointDef_get_collideConnected_0=function(){return (Rm=a._emscripten_bind_b2PulleyJointDef_get_collideConnected_0=a.asm.Hk).apply(null,arguments)},Sm=a._emscripten_bind_b2PulleyJointDef_set_collideConnected_1=
function(){return (Sm=a._emscripten_bind_b2PulleyJointDef_set_collideConnected_1=a.asm.Ik).apply(null,arguments)},Tm=a._emscripten_bind_b2PulleyJointDef___destroy___0=function(){return (Tm=a._emscripten_bind_b2PulleyJointDef___destroy___0=a.asm.Jk).apply(null,arguments)},Um=a._emscripten_bind_b2ManifoldPoint_b2ManifoldPoint_0=function(){return (Um=a._emscripten_bind_b2ManifoldPoint_b2ManifoldPoint_0=a.asm.Kk).apply(null,arguments)},Vm=a._emscripten_bind_b2ManifoldPoint_get_localPoint_0=function(){return (Vm=
a._emscripten_bind_b2ManifoldPoint_get_localPoint_0=a.asm.Lk).apply(null,arguments)},Wm=a._emscripten_bind_b2ManifoldPoint_set_localPoint_1=function(){return (Wm=a._emscripten_bind_b2ManifoldPoint_set_localPoint_1=a.asm.Mk).apply(null,arguments)},Xm=a._emscripten_bind_b2ManifoldPoint_get_normalImpulse_0=function(){return (Xm=a._emscripten_bind_b2ManifoldPoint_get_normalImpulse_0=a.asm.Nk).apply(null,arguments)},Ym=a._emscripten_bind_b2ManifoldPoint_set_normalImpulse_1=function(){return (Ym=a._emscripten_bind_b2ManifoldPoint_set_normalImpulse_1=
a.asm.Ok).apply(null,arguments)},Zm=a._emscripten_bind_b2ManifoldPoint_get_tangentImpulse_0=function(){return (Zm=a._emscripten_bind_b2ManifoldPoint_get_tangentImpulse_0=a.asm.Pk).apply(null,arguments)},$m=a._emscripten_bind_b2ManifoldPoint_set_tangentImpulse_1=function(){return ($m=a._emscripten_bind_b2ManifoldPoint_set_tangentImpulse_1=a.asm.Qk).apply(null,arguments)},an=a._emscripten_bind_b2ManifoldPoint_get_id_0=function(){return (an=a._emscripten_bind_b2ManifoldPoint_get_id_0=a.asm.Rk).apply(null,
arguments)},bn=a._emscripten_bind_b2ManifoldPoint_set_id_1=function(){return (bn=a._emscripten_bind_b2ManifoldPoint_set_id_1=a.asm.Sk).apply(null,arguments)},cn=a._emscripten_bind_b2ManifoldPoint___destroy___0=function(){return (cn=a._emscripten_bind_b2ManifoldPoint___destroy___0=a.asm.Tk).apply(null,arguments)},dn=a._emscripten_bind_b2Transform_b2Transform_0=function(){return (dn=a._emscripten_bind_b2Transform_b2Transform_0=a.asm.Uk).apply(null,arguments)},en=a._emscripten_bind_b2Transform_b2Transform_2=
function(){return (en=a._emscripten_bind_b2Transform_b2Transform_2=a.asm.Vk).apply(null,arguments)},fn=a._emscripten_bind_b2Transform_SetIdentity_0=function(){return (fn=a._emscripten_bind_b2Transform_SetIdentity_0=a.asm.Wk).apply(null,arguments)},gn=a._emscripten_bind_b2Transform_Set_2=function(){return (gn=a._emscripten_bind_b2Transform_Set_2=a.asm.Xk).apply(null,arguments)},hn=a._emscripten_bind_b2Transform_get_p_0=function(){return (hn=a._emscripten_bind_b2Transform_get_p_0=a.asm.Yk).apply(null,arguments)},
jn=a._emscripten_bind_b2Transform_set_p_1=function(){return (jn=a._emscripten_bind_b2Transform_set_p_1=a.asm.Zk).apply(null,arguments)},kn=a._emscripten_bind_b2Transform_get_q_0=function(){return (kn=a._emscripten_bind_b2Transform_get_q_0=a.asm._k).apply(null,arguments)},ln=a._emscripten_bind_b2Transform_set_q_1=function(){return (ln=a._emscripten_bind_b2Transform_set_q_1=a.asm.$k).apply(null,arguments)},mn=a._emscripten_bind_b2Transform___destroy___0=function(){return (mn=a._emscripten_bind_b2Transform___destroy___0=
a.asm.al).apply(null,arguments)},nn=a._emscripten_bind_b2ChainShape_b2ChainShape_0=function(){return (nn=a._emscripten_bind_b2ChainShape_b2ChainShape_0=a.asm.bl).apply(null,arguments)},on=a._emscripten_bind_b2ChainShape_Clear_0=function(){return (on=a._emscripten_bind_b2ChainShape_Clear_0=a.asm.cl).apply(null,arguments)},pn=a._emscripten_bind_b2ChainShape_CreateLoop_2=function(){return (pn=a._emscripten_bind_b2ChainShape_CreateLoop_2=a.asm.dl).apply(null,arguments)},qn=a._emscripten_bind_b2ChainShape_CreateChain_2=
function(){return (qn=a._emscripten_bind_b2ChainShape_CreateChain_2=a.asm.el).apply(null,arguments)},rn=a._emscripten_bind_b2ChainShape_SetPrevVertex_1=function(){return (rn=a._emscripten_bind_b2ChainShape_SetPrevVertex_1=a.asm.fl).apply(null,arguments)},sn=a._emscripten_bind_b2ChainShape_SetNextVertex_1=function(){return (sn=a._emscripten_bind_b2ChainShape_SetNextVertex_1=a.asm.gl).apply(null,arguments)},tn=a._emscripten_bind_b2ChainShape_GetChildEdge_2=function(){return (tn=a._emscripten_bind_b2ChainShape_GetChildEdge_2=
a.asm.hl).apply(null,arguments)},un=a._emscripten_bind_b2ChainShape_GetType_0=function(){return (un=a._emscripten_bind_b2ChainShape_GetType_0=a.asm.il).apply(null,arguments)},vn=a._emscripten_bind_b2ChainShape_GetChildCount_0=function(){return (vn=a._emscripten_bind_b2ChainShape_GetChildCount_0=a.asm.jl).apply(null,arguments)},wn=a._emscripten_bind_b2ChainShape_TestPoint_2=function(){return (wn=a._emscripten_bind_b2ChainShape_TestPoint_2=a.asm.kl).apply(null,arguments)},xn=a._emscripten_bind_b2ChainShape_RayCast_4=
function(){return (xn=a._emscripten_bind_b2ChainShape_RayCast_4=a.asm.ll).apply(null,arguments)},yn=a._emscripten_bind_b2ChainShape_ComputeAABB_3=function(){return (yn=a._emscripten_bind_b2ChainShape_ComputeAABB_3=a.asm.ml).apply(null,arguments)},zn=a._emscripten_bind_b2ChainShape_ComputeMass_2=function(){return (zn=a._emscripten_bind_b2ChainShape_ComputeMass_2=a.asm.nl).apply(null,arguments)},An=a._emscripten_bind_b2ChainShape_get_m_vertices_0=function(){return (An=a._emscripten_bind_b2ChainShape_get_m_vertices_0=
a.asm.ol).apply(null,arguments)},Bn=a._emscripten_bind_b2ChainShape_set_m_vertices_1=function(){return (Bn=a._emscripten_bind_b2ChainShape_set_m_vertices_1=a.asm.pl).apply(null,arguments)},Cn=a._emscripten_bind_b2ChainShape_get_m_count_0=function(){return (Cn=a._emscripten_bind_b2ChainShape_get_m_count_0=a.asm.ql).apply(null,arguments)},Dn=a._emscripten_bind_b2ChainShape_set_m_count_1=function(){return (Dn=a._emscripten_bind_b2ChainShape_set_m_count_1=a.asm.rl).apply(null,arguments)},En=a._emscripten_bind_b2ChainShape_get_m_prevVertex_0=
function(){return (En=a._emscripten_bind_b2ChainShape_get_m_prevVertex_0=a.asm.sl).apply(null,arguments)},Fn=a._emscripten_bind_b2ChainShape_set_m_prevVertex_1=function(){return (Fn=a._emscripten_bind_b2ChainShape_set_m_prevVertex_1=a.asm.tl).apply(null,arguments)},Gn=a._emscripten_bind_b2ChainShape_get_m_nextVertex_0=function(){return (Gn=a._emscripten_bind_b2ChainShape_get_m_nextVertex_0=a.asm.ul).apply(null,arguments)},Hn=a._emscripten_bind_b2ChainShape_set_m_nextVertex_1=function(){return (Hn=a._emscripten_bind_b2ChainShape_set_m_nextVertex_1=
a.asm.vl).apply(null,arguments)},In=a._emscripten_bind_b2ChainShape_get_m_hasPrevVertex_0=function(){return (In=a._emscripten_bind_b2ChainShape_get_m_hasPrevVertex_0=a.asm.wl).apply(null,arguments)},Jn=a._emscripten_bind_b2ChainShape_set_m_hasPrevVertex_1=function(){return (Jn=a._emscripten_bind_b2ChainShape_set_m_hasPrevVertex_1=a.asm.xl).apply(null,arguments)},Kn=a._emscripten_bind_b2ChainShape_get_m_hasNextVertex_0=function(){return (Kn=a._emscripten_bind_b2ChainShape_get_m_hasNextVertex_0=a.asm.yl).apply(null,
arguments)},Ln=a._emscripten_bind_b2ChainShape_set_m_hasNextVertex_1=function(){return (Ln=a._emscripten_bind_b2ChainShape_set_m_hasNextVertex_1=a.asm.zl).apply(null,arguments)},Mn=a._emscripten_bind_b2ChainShape_get_m_type_0=function(){return (Mn=a._emscripten_bind_b2ChainShape_get_m_type_0=a.asm.Al).apply(null,arguments)},Nn=a._emscripten_bind_b2ChainShape_set_m_type_1=function(){return (Nn=a._emscripten_bind_b2ChainShape_set_m_type_1=a.asm.Bl).apply(null,arguments)},On=a._emscripten_bind_b2ChainShape_get_m_radius_0=
function(){return (On=a._emscripten_bind_b2ChainShape_get_m_radius_0=a.asm.Cl).apply(null,arguments)},Pn=a._emscripten_bind_b2ChainShape_set_m_radius_1=function(){return (Pn=a._emscripten_bind_b2ChainShape_set_m_radius_1=a.asm.Dl).apply(null,arguments)},Qn=a._emscripten_bind_b2ChainShape___destroy___0=function(){return (Qn=a._emscripten_bind_b2ChainShape___destroy___0=a.asm.El).apply(null,arguments)},Rn=a._emscripten_bind_b2Color_b2Color_0=function(){return (Rn=a._emscripten_bind_b2Color_b2Color_0=a.asm.Fl).apply(null,
arguments)},Sn=a._emscripten_bind_b2Color_b2Color_3=function(){return (Sn=a._emscripten_bind_b2Color_b2Color_3=a.asm.Gl).apply(null,arguments)},Tn=a._emscripten_bind_b2Color_Set_3=function(){return (Tn=a._emscripten_bind_b2Color_Set_3=a.asm.Hl).apply(null,arguments)},Un=a._emscripten_bind_b2Color_get_r_0=function(){return (Un=a._emscripten_bind_b2Color_get_r_0=a.asm.Il).apply(null,arguments)},Vn=a._emscripten_bind_b2Color_set_r_1=function(){return (Vn=a._emscripten_bind_b2Color_set_r_1=a.asm.Jl).apply(null,
arguments)},Wn=a._emscripten_bind_b2Color_get_g_0=function(){return (Wn=a._emscripten_bind_b2Color_get_g_0=a.asm.Kl).apply(null,arguments)},Xn=a._emscripten_bind_b2Color_set_g_1=function(){return (Xn=a._emscripten_bind_b2Color_set_g_1=a.asm.Ll).apply(null,arguments)},Yn=a._emscripten_bind_b2Color_get_b_0=function(){return (Yn=a._emscripten_bind_b2Color_get_b_0=a.asm.Ml).apply(null,arguments)},Zn=a._emscripten_bind_b2Color_set_b_1=function(){return (Zn=a._emscripten_bind_b2Color_set_b_1=a.asm.Nl).apply(null,
arguments)},$n=a._emscripten_bind_b2Color___destroy___0=function(){return ($n=a._emscripten_bind_b2Color___destroy___0=a.asm.Ol).apply(null,arguments)},ao=a._emscripten_bind_b2RopeJoint_GetLocalAnchorA_0=function(){return (ao=a._emscripten_bind_b2RopeJoint_GetLocalAnchorA_0=a.asm.Pl).apply(null,arguments)},bo=a._emscripten_bind_b2RopeJoint_GetLocalAnchorB_0=function(){return (bo=a._emscripten_bind_b2RopeJoint_GetLocalAnchorB_0=a.asm.Ql).apply(null,arguments)},co=a._emscripten_bind_b2RopeJoint_SetMaxLength_1=
function(){return (co=a._emscripten_bind_b2RopeJoint_SetMaxLength_1=a.asm.Rl).apply(null,arguments)},eo=a._emscripten_bind_b2RopeJoint_GetMaxLength_0=function(){return (eo=a._emscripten_bind_b2RopeJoint_GetMaxLength_0=a.asm.Sl).apply(null,arguments)},fo=a._emscripten_bind_b2RopeJoint_GetLimitState_0=function(){return (fo=a._emscripten_bind_b2RopeJoint_GetLimitState_0=a.asm.Tl).apply(null,arguments)},go=a._emscripten_bind_b2RopeJoint_GetType_0=function(){return (go=a._emscripten_bind_b2RopeJoint_GetType_0=
a.asm.Ul).apply(null,arguments)},ho=a._emscripten_bind_b2RopeJoint_GetBodyA_0=function(){return (ho=a._emscripten_bind_b2RopeJoint_GetBodyA_0=a.asm.Vl).apply(null,arguments)},io=a._emscripten_bind_b2RopeJoint_GetBodyB_0=function(){return (io=a._emscripten_bind_b2RopeJoint_GetBodyB_0=a.asm.Wl).apply(null,arguments)},jo=a._emscripten_bind_b2RopeJoint_GetAnchorA_0=function(){return (jo=a._emscripten_bind_b2RopeJoint_GetAnchorA_0=a.asm.Xl).apply(null,arguments)},ko=a._emscripten_bind_b2RopeJoint_GetAnchorB_0=
function(){return (ko=a._emscripten_bind_b2RopeJoint_GetAnchorB_0=a.asm.Yl).apply(null,arguments)},lo=a._emscripten_bind_b2RopeJoint_GetReactionForce_1=function(){return (lo=a._emscripten_bind_b2RopeJoint_GetReactionForce_1=a.asm.Zl).apply(null,arguments)},mo=a._emscripten_bind_b2RopeJoint_GetReactionTorque_1=function(){return (mo=a._emscripten_bind_b2RopeJoint_GetReactionTorque_1=a.asm._l).apply(null,arguments)},no=a._emscripten_bind_b2RopeJoint_GetNext_0=function(){return (no=a._emscripten_bind_b2RopeJoint_GetNext_0=
a.asm.$l).apply(null,arguments)},oo=a._emscripten_bind_b2RopeJoint_GetUserData_0=function(){return (oo=a._emscripten_bind_b2RopeJoint_GetUserData_0=a.asm.am).apply(null,arguments)},po=a._emscripten_bind_b2RopeJoint_SetUserData_1=function(){return (po=a._emscripten_bind_b2RopeJoint_SetUserData_1=a.asm.bm).apply(null,arguments)},qo=a._emscripten_bind_b2RopeJoint_IsActive_0=function(){return (qo=a._emscripten_bind_b2RopeJoint_IsActive_0=a.asm.cm).apply(null,arguments)},ro=a._emscripten_bind_b2RopeJoint_GetCollideConnected_0=
function(){return (ro=a._emscripten_bind_b2RopeJoint_GetCollideConnected_0=a.asm.dm).apply(null,arguments)},so=a._emscripten_bind_b2RopeJoint___destroy___0=function(){return (so=a._emscripten_bind_b2RopeJoint___destroy___0=a.asm.em).apply(null,arguments)},to=a._emscripten_bind_b2RayCastInput_get_p1_0=function(){return (to=a._emscripten_bind_b2RayCastInput_get_p1_0=a.asm.fm).apply(null,arguments)},uo=a._emscripten_bind_b2RayCastInput_set_p1_1=function(){return (uo=a._emscripten_bind_b2RayCastInput_set_p1_1=
a.asm.gm).apply(null,arguments)},vo=a._emscripten_bind_b2RayCastInput_get_p2_0=function(){return (vo=a._emscripten_bind_b2RayCastInput_get_p2_0=a.asm.hm).apply(null,arguments)},wo=a._emscripten_bind_b2RayCastInput_set_p2_1=function(){return (wo=a._emscripten_bind_b2RayCastInput_set_p2_1=a.asm.im).apply(null,arguments)},xo=a._emscripten_bind_b2RayCastInput_get_maxFraction_0=function(){return (xo=a._emscripten_bind_b2RayCastInput_get_maxFraction_0=a.asm.jm).apply(null,arguments)},yo=a._emscripten_bind_b2RayCastInput_set_maxFraction_1=
function(){return (yo=a._emscripten_bind_b2RayCastInput_set_maxFraction_1=a.asm.km).apply(null,arguments)},zo=a._emscripten_bind_b2RayCastInput___destroy___0=function(){return (zo=a._emscripten_bind_b2RayCastInput___destroy___0=a.asm.lm).apply(null,arguments)},Ao=a._emscripten_bind_b2PolygonShape_b2PolygonShape_0=function(){return (Ao=a._emscripten_bind_b2PolygonShape_b2PolygonShape_0=a.asm.mm).apply(null,arguments)},Bo=a._emscripten_bind_b2PolygonShape_Set_2=function(){return (Bo=a._emscripten_bind_b2PolygonShape_Set_2=
a.asm.nm).apply(null,arguments)},Co=a._emscripten_bind_b2PolygonShape_SetAsBox_2=function(){return (Co=a._emscripten_bind_b2PolygonShape_SetAsBox_2=a.asm.om).apply(null,arguments)},Do=a._emscripten_bind_b2PolygonShape_SetAsBox_4=function(){return (Do=a._emscripten_bind_b2PolygonShape_SetAsBox_4=a.asm.pm).apply(null,arguments)},Eo=a._emscripten_bind_b2PolygonShape_GetVertexCount_0=function(){return (Eo=a._emscripten_bind_b2PolygonShape_GetVertexCount_0=a.asm.qm).apply(null,arguments)},Fo=a._emscripten_bind_b2PolygonShape_GetVertex_1=
function(){return (Fo=a._emscripten_bind_b2PolygonShape_GetVertex_1=a.asm.rm).apply(null,arguments)},Go=a._emscripten_bind_b2PolygonShape_GetType_0=function(){return (Go=a._emscripten_bind_b2PolygonShape_GetType_0=a.asm.sm).apply(null,arguments)},Ho=a._emscripten_bind_b2PolygonShape_GetChildCount_0=function(){return (Ho=a._emscripten_bind_b2PolygonShape_GetChildCount_0=a.asm.tm).apply(null,arguments)},Io=a._emscripten_bind_b2PolygonShape_TestPoint_2=function(){return (Io=a._emscripten_bind_b2PolygonShape_TestPoint_2=
a.asm.um).apply(null,arguments)},Jo=a._emscripten_bind_b2PolygonShape_RayCast_4=function(){return (Jo=a._emscripten_bind_b2PolygonShape_RayCast_4=a.asm.vm).apply(null,arguments)},Ko=a._emscripten_bind_b2PolygonShape_ComputeAABB_3=function(){return (Ko=a._emscripten_bind_b2PolygonShape_ComputeAABB_3=a.asm.wm).apply(null,arguments)},Lo=a._emscripten_bind_b2PolygonShape_ComputeMass_2=function(){return (Lo=a._emscripten_bind_b2PolygonShape_ComputeMass_2=a.asm.xm).apply(null,arguments)},Mo=a._emscripten_bind_b2PolygonShape_get_m_centroid_0=
function(){return (Mo=a._emscripten_bind_b2PolygonShape_get_m_centroid_0=a.asm.ym).apply(null,arguments)},No=a._emscripten_bind_b2PolygonShape_set_m_centroid_1=function(){return (No=a._emscripten_bind_b2PolygonShape_set_m_centroid_1=a.asm.zm).apply(null,arguments)},Oo=a._emscripten_bind_b2PolygonShape_get_m_count_0=function(){return (Oo=a._emscripten_bind_b2PolygonShape_get_m_count_0=a.asm.Am).apply(null,arguments)},Po=a._emscripten_bind_b2PolygonShape_set_m_count_1=function(){return (Po=a._emscripten_bind_b2PolygonShape_set_m_count_1=
a.asm.Bm).apply(null,arguments)},Qo=a._emscripten_bind_b2PolygonShape_get_m_type_0=function(){return (Qo=a._emscripten_bind_b2PolygonShape_get_m_type_0=a.asm.Cm).apply(null,arguments)},Ro=a._emscripten_bind_b2PolygonShape_set_m_type_1=function(){return (Ro=a._emscripten_bind_b2PolygonShape_set_m_type_1=a.asm.Dm).apply(null,arguments)},So=a._emscripten_bind_b2PolygonShape_get_m_radius_0=function(){return (So=a._emscripten_bind_b2PolygonShape_get_m_radius_0=a.asm.Em).apply(null,arguments)},To=a._emscripten_bind_b2PolygonShape_set_m_radius_1=
function(){return (To=a._emscripten_bind_b2PolygonShape_set_m_radius_1=a.asm.Fm).apply(null,arguments)},Uo=a._emscripten_bind_b2PolygonShape___destroy___0=function(){return (Uo=a._emscripten_bind_b2PolygonShape___destroy___0=a.asm.Gm).apply(null,arguments)},Vo=a._emscripten_bind_b2EdgeShape_b2EdgeShape_0=function(){return (Vo=a._emscripten_bind_b2EdgeShape_b2EdgeShape_0=a.asm.Hm).apply(null,arguments)},Wo=a._emscripten_bind_b2EdgeShape_Set_2=function(){return (Wo=a._emscripten_bind_b2EdgeShape_Set_2=
a.asm.Im).apply(null,arguments)},Xo=a._emscripten_bind_b2EdgeShape_GetType_0=function(){return (Xo=a._emscripten_bind_b2EdgeShape_GetType_0=a.asm.Jm).apply(null,arguments)},Yo=a._emscripten_bind_b2EdgeShape_GetChildCount_0=function(){return (Yo=a._emscripten_bind_b2EdgeShape_GetChildCount_0=a.asm.Km).apply(null,arguments)},Zo=a._emscripten_bind_b2EdgeShape_TestPoint_2=function(){return (Zo=a._emscripten_bind_b2EdgeShape_TestPoint_2=a.asm.Lm).apply(null,arguments)},$o=a._emscripten_bind_b2EdgeShape_RayCast_4=
function(){return ($o=a._emscripten_bind_b2EdgeShape_RayCast_4=a.asm.Mm).apply(null,arguments)},ap=a._emscripten_bind_b2EdgeShape_ComputeAABB_3=function(){return (ap=a._emscripten_bind_b2EdgeShape_ComputeAABB_3=a.asm.Nm).apply(null,arguments)},bp=a._emscripten_bind_b2EdgeShape_ComputeMass_2=function(){return (bp=a._emscripten_bind_b2EdgeShape_ComputeMass_2=a.asm.Om).apply(null,arguments)},cp=a._emscripten_bind_b2EdgeShape_get_m_vertex1_0=function(){return (cp=a._emscripten_bind_b2EdgeShape_get_m_vertex1_0=
a.asm.Pm).apply(null,arguments)},dp=a._emscripten_bind_b2EdgeShape_set_m_vertex1_1=function(){return (dp=a._emscripten_bind_b2EdgeShape_set_m_vertex1_1=a.asm.Qm).apply(null,arguments)},ep=a._emscripten_bind_b2EdgeShape_get_m_vertex2_0=function(){return (ep=a._emscripten_bind_b2EdgeShape_get_m_vertex2_0=a.asm.Rm).apply(null,arguments)},fp=a._emscripten_bind_b2EdgeShape_set_m_vertex2_1=function(){return (fp=a._emscripten_bind_b2EdgeShape_set_m_vertex2_1=a.asm.Sm).apply(null,arguments)},gp=a._emscripten_bind_b2EdgeShape_get_m_vertex0_0=
function(){return (gp=a._emscripten_bind_b2EdgeShape_get_m_vertex0_0=a.asm.Tm).apply(null,arguments)},hp=a._emscripten_bind_b2EdgeShape_set_m_vertex0_1=function(){return (hp=a._emscripten_bind_b2EdgeShape_set_m_vertex0_1=a.asm.Um).apply(null,arguments)},ip=a._emscripten_bind_b2EdgeShape_get_m_vertex3_0=function(){return (ip=a._emscripten_bind_b2EdgeShape_get_m_vertex3_0=a.asm.Vm).apply(null,arguments)},jp=a._emscripten_bind_b2EdgeShape_set_m_vertex3_1=function(){return (jp=a._emscripten_bind_b2EdgeShape_set_m_vertex3_1=
a.asm.Wm).apply(null,arguments)},kp=a._emscripten_bind_b2EdgeShape_get_m_hasVertex0_0=function(){return (kp=a._emscripten_bind_b2EdgeShape_get_m_hasVertex0_0=a.asm.Xm).apply(null,arguments)},lp=a._emscripten_bind_b2EdgeShape_set_m_hasVertex0_1=function(){return (lp=a._emscripten_bind_b2EdgeShape_set_m_hasVertex0_1=a.asm.Ym).apply(null,arguments)},mp=a._emscripten_bind_b2EdgeShape_get_m_hasVertex3_0=function(){return (mp=a._emscripten_bind_b2EdgeShape_get_m_hasVertex3_0=a.asm.Zm).apply(null,arguments)},
np=a._emscripten_bind_b2EdgeShape_set_m_hasVertex3_1=function(){return (np=a._emscripten_bind_b2EdgeShape_set_m_hasVertex3_1=a.asm._m).apply(null,arguments)},op=a._emscripten_bind_b2EdgeShape_get_m_type_0=function(){return (op=a._emscripten_bind_b2EdgeShape_get_m_type_0=a.asm.$m).apply(null,arguments)},pp=a._emscripten_bind_b2EdgeShape_set_m_type_1=function(){return (pp=a._emscripten_bind_b2EdgeShape_set_m_type_1=a.asm.an).apply(null,arguments)},qp=a._emscripten_bind_b2EdgeShape_get_m_radius_0=function(){return (qp=
a._emscripten_bind_b2EdgeShape_get_m_radius_0=a.asm.bn).apply(null,arguments)},rp=a._emscripten_bind_b2EdgeShape_set_m_radius_1=function(){return (rp=a._emscripten_bind_b2EdgeShape_set_m_radius_1=a.asm.cn).apply(null,arguments)},sp=a._emscripten_bind_b2EdgeShape___destroy___0=function(){return (sp=a._emscripten_bind_b2EdgeShape___destroy___0=a.asm.dn).apply(null,arguments)},tp=a._emscripten_bind_JSContactFilter_JSContactFilter_0=function(){return (tp=a._emscripten_bind_JSContactFilter_JSContactFilter_0=
a.asm.en).apply(null,arguments)},up=a._emscripten_bind_JSContactFilter_ShouldCollide_2=function(){return (up=a._emscripten_bind_JSContactFilter_ShouldCollide_2=a.asm.fn).apply(null,arguments)},vp=a._emscripten_bind_JSContactFilter___destroy___0=function(){return (vp=a._emscripten_bind_JSContactFilter___destroy___0=a.asm.gn).apply(null,arguments)},wp=a._emscripten_bind_b2RevoluteJointDef_b2RevoluteJointDef_0=function(){return (wp=a._emscripten_bind_b2RevoluteJointDef_b2RevoluteJointDef_0=a.asm.hn).apply(null,
arguments)},xp=a._emscripten_bind_b2RevoluteJointDef_Initialize_3=function(){return (xp=a._emscripten_bind_b2RevoluteJointDef_Initialize_3=a.asm.jn).apply(null,arguments)},yp=a._emscripten_bind_b2RevoluteJointDef_get_localAnchorA_0=function(){return (yp=a._emscripten_bind_b2RevoluteJointDef_get_localAnchorA_0=a.asm.kn).apply(null,arguments)},zp=a._emscripten_bind_b2RevoluteJointDef_set_localAnchorA_1=function(){return (zp=a._emscripten_bind_b2RevoluteJointDef_set_localAnchorA_1=a.asm.ln).apply(null,
arguments)},Ap=a._emscripten_bind_b2RevoluteJointDef_get_localAnchorB_0=function(){return (Ap=a._emscripten_bind_b2RevoluteJointDef_get_localAnchorB_0=a.asm.mn).apply(null,arguments)},Bp=a._emscripten_bind_b2RevoluteJointDef_set_localAnchorB_1=function(){return (Bp=a._emscripten_bind_b2RevoluteJointDef_set_localAnchorB_1=a.asm.nn).apply(null,arguments)},Cp=a._emscripten_bind_b2RevoluteJointDef_get_referenceAngle_0=function(){return (Cp=a._emscripten_bind_b2RevoluteJointDef_get_referenceAngle_0=a.asm.on).apply(null,
arguments)},Dp=a._emscripten_bind_b2RevoluteJointDef_set_referenceAngle_1=function(){return (Dp=a._emscripten_bind_b2RevoluteJointDef_set_referenceAngle_1=a.asm.pn).apply(null,arguments)},Ep=a._emscripten_bind_b2RevoluteJointDef_get_enableLimit_0=function(){return (Ep=a._emscripten_bind_b2RevoluteJointDef_get_enableLimit_0=a.asm.qn).apply(null,arguments)},Fp=a._emscripten_bind_b2RevoluteJointDef_set_enableLimit_1=function(){return (Fp=a._emscripten_bind_b2RevoluteJointDef_set_enableLimit_1=a.asm.rn).apply(null,
arguments)},Gp=a._emscripten_bind_b2RevoluteJointDef_get_lowerAngle_0=function(){return (Gp=a._emscripten_bind_b2RevoluteJointDef_get_lowerAngle_0=a.asm.sn).apply(null,arguments)},Hp=a._emscripten_bind_b2RevoluteJointDef_set_lowerAngle_1=function(){return (Hp=a._emscripten_bind_b2RevoluteJointDef_set_lowerAngle_1=a.asm.tn).apply(null,arguments)},Ip=a._emscripten_bind_b2RevoluteJointDef_get_upperAngle_0=function(){return (Ip=a._emscripten_bind_b2RevoluteJointDef_get_upperAngle_0=a.asm.un).apply(null,
arguments)},Jp=a._emscripten_bind_b2RevoluteJointDef_set_upperAngle_1=function(){return (Jp=a._emscripten_bind_b2RevoluteJointDef_set_upperAngle_1=a.asm.vn).apply(null,arguments)},Kp=a._emscripten_bind_b2RevoluteJointDef_get_enableMotor_0=function(){return (Kp=a._emscripten_bind_b2RevoluteJointDef_get_enableMotor_0=a.asm.wn).apply(null,arguments)},Lp=a._emscripten_bind_b2RevoluteJointDef_set_enableMotor_1=function(){return (Lp=a._emscripten_bind_b2RevoluteJointDef_set_enableMotor_1=a.asm.xn).apply(null,
arguments)},Mp=a._emscripten_bind_b2RevoluteJointDef_get_motorSpeed_0=function(){return (Mp=a._emscripten_bind_b2RevoluteJointDef_get_motorSpeed_0=a.asm.yn).apply(null,arguments)},Np=a._emscripten_bind_b2RevoluteJointDef_set_motorSpeed_1=function(){return (Np=a._emscripten_bind_b2RevoluteJointDef_set_motorSpeed_1=a.asm.zn).apply(null,arguments)},Op=a._emscripten_bind_b2RevoluteJointDef_get_maxMotorTorque_0=function(){return (Op=a._emscripten_bind_b2RevoluteJointDef_get_maxMotorTorque_0=a.asm.An).apply(null,
arguments)},Pp=a._emscripten_bind_b2RevoluteJointDef_set_maxMotorTorque_1=function(){return (Pp=a._emscripten_bind_b2RevoluteJointDef_set_maxMotorTorque_1=a.asm.Bn).apply(null,arguments)},Qp=a._emscripten_bind_b2RevoluteJointDef_get_type_0=function(){return (Qp=a._emscripten_bind_b2RevoluteJointDef_get_type_0=a.asm.Cn).apply(null,arguments)},Rp=a._emscripten_bind_b2RevoluteJointDef_set_type_1=function(){return (Rp=a._emscripten_bind_b2RevoluteJointDef_set_type_1=a.asm.Dn).apply(null,arguments)},Sp=a._emscripten_bind_b2RevoluteJointDef_get_userData_0=
function(){return (Sp=a._emscripten_bind_b2RevoluteJointDef_get_userData_0=a.asm.En).apply(null,arguments)},Tp=a._emscripten_bind_b2RevoluteJointDef_set_userData_1=function(){return (Tp=a._emscripten_bind_b2RevoluteJointDef_set_userData_1=a.asm.Fn).apply(null,arguments)},Up=a._emscripten_bind_b2RevoluteJointDef_get_bodyA_0=function(){return (Up=a._emscripten_bind_b2RevoluteJointDef_get_bodyA_0=a.asm.Gn).apply(null,arguments)},Vp=a._emscripten_bind_b2RevoluteJointDef_set_bodyA_1=function(){return (Vp=
a._emscripten_bind_b2RevoluteJointDef_set_bodyA_1=a.asm.Hn).apply(null,arguments)},Wp=a._emscripten_bind_b2RevoluteJointDef_get_bodyB_0=function(){return (Wp=a._emscripten_bind_b2RevoluteJointDef_get_bodyB_0=a.asm.In).apply(null,arguments)},Xp=a._emscripten_bind_b2RevoluteJointDef_set_bodyB_1=function(){return (Xp=a._emscripten_bind_b2RevoluteJointDef_set_bodyB_1=a.asm.Jn).apply(null,arguments)},Yp=a._emscripten_bind_b2RevoluteJointDef_get_collideConnected_0=function(){return (Yp=a._emscripten_bind_b2RevoluteJointDef_get_collideConnected_0=
a.asm.Kn).apply(null,arguments)},Zp=a._emscripten_bind_b2RevoluteJointDef_set_collideConnected_1=function(){return (Zp=a._emscripten_bind_b2RevoluteJointDef_set_collideConnected_1=a.asm.Ln).apply(null,arguments)},$p=a._emscripten_bind_b2RevoluteJointDef___destroy___0=function(){return ($p=a._emscripten_bind_b2RevoluteJointDef___destroy___0=a.asm.Mn).apply(null,arguments)},aq=a._emscripten_bind_JSDraw_JSDraw_0=function(){return (aq=a._emscripten_bind_JSDraw_JSDraw_0=a.asm.Nn).apply(null,arguments)},bq=
a._emscripten_bind_JSDraw_DrawPolygon_3=function(){return (bq=a._emscripten_bind_JSDraw_DrawPolygon_3=a.asm.On).apply(null,arguments)},cq=a._emscripten_bind_JSDraw_DrawSolidPolygon_3=function(){return (cq=a._emscripten_bind_JSDraw_DrawSolidPolygon_3=a.asm.Pn).apply(null,arguments)},dq=a._emscripten_bind_JSDraw_DrawCircle_3=function(){return (dq=a._emscripten_bind_JSDraw_DrawCircle_3=a.asm.Qn).apply(null,arguments)},eq=a._emscripten_bind_JSDraw_DrawSolidCircle_4=function(){return (eq=a._emscripten_bind_JSDraw_DrawSolidCircle_4=
a.asm.Rn).apply(null,arguments)},fq=a._emscripten_bind_JSDraw_DrawSegment_3=function(){return (fq=a._emscripten_bind_JSDraw_DrawSegment_3=a.asm.Sn).apply(null,arguments)},gq=a._emscripten_bind_JSDraw_DrawTransform_1=function(){return (gq=a._emscripten_bind_JSDraw_DrawTransform_1=a.asm.Tn).apply(null,arguments)},hq=a._emscripten_bind_JSDraw___destroy___0=function(){return (hq=a._emscripten_bind_JSDraw___destroy___0=a.asm.Un).apply(null,arguments)},iq=a._emscripten_bind_b2WheelJoint_GetLocalAnchorA_0=
function(){return (iq=a._emscripten_bind_b2WheelJoint_GetLocalAnchorA_0=a.asm.Vn).apply(null,arguments)},jq=a._emscripten_bind_b2WheelJoint_GetLocalAnchorB_0=function(){return (jq=a._emscripten_bind_b2WheelJoint_GetLocalAnchorB_0=a.asm.Wn).apply(null,arguments)},kq=a._emscripten_bind_b2WheelJoint_GetLocalAxisA_0=function(){return (kq=a._emscripten_bind_b2WheelJoint_GetLocalAxisA_0=a.asm.Xn).apply(null,arguments)},lq=a._emscripten_bind_b2WheelJoint_GetJointTranslation_0=function(){return (lq=a._emscripten_bind_b2WheelJoint_GetJointTranslation_0=
a.asm.Yn).apply(null,arguments)},mq=a._emscripten_bind_b2WheelJoint_GetJointSpeed_0=function(){return (mq=a._emscripten_bind_b2WheelJoint_GetJointSpeed_0=a.asm.Zn).apply(null,arguments)},nq=a._emscripten_bind_b2WheelJoint_IsMotorEnabled_0=function(){return (nq=a._emscripten_bind_b2WheelJoint_IsMotorEnabled_0=a.asm._n).apply(null,arguments)},oq=a._emscripten_bind_b2WheelJoint_EnableMotor_1=function(){return (oq=a._emscripten_bind_b2WheelJoint_EnableMotor_1=a.asm.$n).apply(null,arguments)},pq=a._emscripten_bind_b2WheelJoint_SetMotorSpeed_1=
function(){return (pq=a._emscripten_bind_b2WheelJoint_SetMotorSpeed_1=a.asm.ao).apply(null,arguments)},qq=a._emscripten_bind_b2WheelJoint_GetMotorSpeed_0=function(){return (qq=a._emscripten_bind_b2WheelJoint_GetMotorSpeed_0=a.asm.bo).apply(null,arguments)},rq=a._emscripten_bind_b2WheelJoint_SetMaxMotorTorque_1=function(){return (rq=a._emscripten_bind_b2WheelJoint_SetMaxMotorTorque_1=a.asm.co).apply(null,arguments)},sq=a._emscripten_bind_b2WheelJoint_GetMaxMotorTorque_0=function(){return (sq=a._emscripten_bind_b2WheelJoint_GetMaxMotorTorque_0=
a.asm.eo).apply(null,arguments)},tq=a._emscripten_bind_b2WheelJoint_GetMotorTorque_1=function(){return (tq=a._emscripten_bind_b2WheelJoint_GetMotorTorque_1=a.asm.fo).apply(null,arguments)},uq=a._emscripten_bind_b2WheelJoint_SetSpringFrequencyHz_1=function(){return (uq=a._emscripten_bind_b2WheelJoint_SetSpringFrequencyHz_1=a.asm.go).apply(null,arguments)},vq=a._emscripten_bind_b2WheelJoint_GetSpringFrequencyHz_0=function(){return (vq=a._emscripten_bind_b2WheelJoint_GetSpringFrequencyHz_0=a.asm.ho).apply(null,
arguments)},wq=a._emscripten_bind_b2WheelJoint_SetSpringDampingRatio_1=function(){return (wq=a._emscripten_bind_b2WheelJoint_SetSpringDampingRatio_1=a.asm.io).apply(null,arguments)},xq=a._emscripten_bind_b2WheelJoint_GetSpringDampingRatio_0=function(){return (xq=a._emscripten_bind_b2WheelJoint_GetSpringDampingRatio_0=a.asm.jo).apply(null,arguments)},yq=a._emscripten_bind_b2WheelJoint_GetType_0=function(){return (yq=a._emscripten_bind_b2WheelJoint_GetType_0=a.asm.ko).apply(null,arguments)},zq=a._emscripten_bind_b2WheelJoint_GetBodyA_0=
function(){return (zq=a._emscripten_bind_b2WheelJoint_GetBodyA_0=a.asm.lo).apply(null,arguments)},Aq=a._emscripten_bind_b2WheelJoint_GetBodyB_0=function(){return (Aq=a._emscripten_bind_b2WheelJoint_GetBodyB_0=a.asm.mo).apply(null,arguments)},Bq=a._emscripten_bind_b2WheelJoint_GetAnchorA_0=function(){return (Bq=a._emscripten_bind_b2WheelJoint_GetAnchorA_0=a.asm.no).apply(null,arguments)},Cq=a._emscripten_bind_b2WheelJoint_GetAnchorB_0=function(){return (Cq=a._emscripten_bind_b2WheelJoint_GetAnchorB_0=
a.asm.oo).apply(null,arguments)},Dq=a._emscripten_bind_b2WheelJoint_GetReactionForce_1=function(){return (Dq=a._emscripten_bind_b2WheelJoint_GetReactionForce_1=a.asm.po).apply(null,arguments)},Eq=a._emscripten_bind_b2WheelJoint_GetReactionTorque_1=function(){return (Eq=a._emscripten_bind_b2WheelJoint_GetReactionTorque_1=a.asm.qo).apply(null,arguments)},Fq=a._emscripten_bind_b2WheelJoint_GetNext_0=function(){return (Fq=a._emscripten_bind_b2WheelJoint_GetNext_0=a.asm.ro).apply(null,arguments)},Gq=a._emscripten_bind_b2WheelJoint_GetUserData_0=
function(){return (Gq=a._emscripten_bind_b2WheelJoint_GetUserData_0=a.asm.so).apply(null,arguments)},Hq=a._emscripten_bind_b2WheelJoint_SetUserData_1=function(){return (Hq=a._emscripten_bind_b2WheelJoint_SetUserData_1=a.asm.to).apply(null,arguments)},Iq=a._emscripten_bind_b2WheelJoint_IsActive_0=function(){return (Iq=a._emscripten_bind_b2WheelJoint_IsActive_0=a.asm.uo).apply(null,arguments)},Jq=a._emscripten_bind_b2WheelJoint_GetCollideConnected_0=function(){return (Jq=a._emscripten_bind_b2WheelJoint_GetCollideConnected_0=
a.asm.vo).apply(null,arguments)},Kq=a._emscripten_bind_b2WheelJoint___destroy___0=function(){return (Kq=a._emscripten_bind_b2WheelJoint___destroy___0=a.asm.wo).apply(null,arguments)},Lq=a._emscripten_bind_b2PulleyJoint_GetGroundAnchorA_0=function(){return (Lq=a._emscripten_bind_b2PulleyJoint_GetGroundAnchorA_0=a.asm.xo).apply(null,arguments)},Mq=a._emscripten_bind_b2PulleyJoint_GetGroundAnchorB_0=function(){return (Mq=a._emscripten_bind_b2PulleyJoint_GetGroundAnchorB_0=a.asm.yo).apply(null,arguments)},
Nq=a._emscripten_bind_b2PulleyJoint_GetLengthA_0=function(){return (Nq=a._emscripten_bind_b2PulleyJoint_GetLengthA_0=a.asm.zo).apply(null,arguments)},Oq=a._emscripten_bind_b2PulleyJoint_GetLengthB_0=function(){return (Oq=a._emscripten_bind_b2PulleyJoint_GetLengthB_0=a.asm.Ao).apply(null,arguments)},Pq=a._emscripten_bind_b2PulleyJoint_GetRatio_0=function(){return (Pq=a._emscripten_bind_b2PulleyJoint_GetRatio_0=a.asm.Bo).apply(null,arguments)},Qq=a._emscripten_bind_b2PulleyJoint_GetCurrentLengthA_0=function(){return (Qq=
a._emscripten_bind_b2PulleyJoint_GetCurrentLengthA_0=a.asm.Co).apply(null,arguments)},Rq=a._emscripten_bind_b2PulleyJoint_GetCurrentLengthB_0=function(){return (Rq=a._emscripten_bind_b2PulleyJoint_GetCurrentLengthB_0=a.asm.Do).apply(null,arguments)},Sq=a._emscripten_bind_b2PulleyJoint_GetType_0=function(){return (Sq=a._emscripten_bind_b2PulleyJoint_GetType_0=a.asm.Eo).apply(null,arguments)},Tq=a._emscripten_bind_b2PulleyJoint_GetBodyA_0=function(){return (Tq=a._emscripten_bind_b2PulleyJoint_GetBodyA_0=
a.asm.Fo).apply(null,arguments)},Uq=a._emscripten_bind_b2PulleyJoint_GetBodyB_0=function(){return (Uq=a._emscripten_bind_b2PulleyJoint_GetBodyB_0=a.asm.Go).apply(null,arguments)},Vq=a._emscripten_bind_b2PulleyJoint_GetAnchorA_0=function(){return (Vq=a._emscripten_bind_b2PulleyJoint_GetAnchorA_0=a.asm.Ho).apply(null,arguments)},Wq=a._emscripten_bind_b2PulleyJoint_GetAnchorB_0=function(){return (Wq=a._emscripten_bind_b2PulleyJoint_GetAnchorB_0=a.asm.Io).apply(null,arguments)},Xq=a._emscripten_bind_b2PulleyJoint_GetReactionForce_1=
function(){return (Xq=a._emscripten_bind_b2PulleyJoint_GetReactionForce_1=a.asm.Jo).apply(null,arguments)},Yq=a._emscripten_bind_b2PulleyJoint_GetReactionTorque_1=function(){return (Yq=a._emscripten_bind_b2PulleyJoint_GetReactionTorque_1=a.asm.Ko).apply(null,arguments)},Zq=a._emscripten_bind_b2PulleyJoint_GetNext_0=function(){return (Zq=a._emscripten_bind_b2PulleyJoint_GetNext_0=a.asm.Lo).apply(null,arguments)},$q=a._emscripten_bind_b2PulleyJoint_GetUserData_0=function(){return ($q=a._emscripten_bind_b2PulleyJoint_GetUserData_0=
a.asm.Mo).apply(null,arguments)},ar=a._emscripten_bind_b2PulleyJoint_SetUserData_1=function(){return (ar=a._emscripten_bind_b2PulleyJoint_SetUserData_1=a.asm.No).apply(null,arguments)},br=a._emscripten_bind_b2PulleyJoint_IsActive_0=function(){return (br=a._emscripten_bind_b2PulleyJoint_IsActive_0=a.asm.Oo).apply(null,arguments)},cr=a._emscripten_bind_b2PulleyJoint_GetCollideConnected_0=function(){return (cr=a._emscripten_bind_b2PulleyJoint_GetCollideConnected_0=a.asm.Po).apply(null,arguments)},dr=a._emscripten_bind_b2PulleyJoint___destroy___0=
function(){return (dr=a._emscripten_bind_b2PulleyJoint___destroy___0=a.asm.Qo).apply(null,arguments)},er=a._emscripten_bind_b2MouseJointDef_b2MouseJointDef_0=function(){return (er=a._emscripten_bind_b2MouseJointDef_b2MouseJointDef_0=a.asm.Ro).apply(null,arguments)},fr=a._emscripten_bind_b2MouseJointDef_get_target_0=function(){return (fr=a._emscripten_bind_b2MouseJointDef_get_target_0=a.asm.So).apply(null,arguments)},gr=a._emscripten_bind_b2MouseJointDef_set_target_1=function(){return (gr=a._emscripten_bind_b2MouseJointDef_set_target_1=
a.asm.To).apply(null,arguments)},hr=a._emscripten_bind_b2MouseJointDef_get_maxForce_0=function(){return (hr=a._emscripten_bind_b2MouseJointDef_get_maxForce_0=a.asm.Uo).apply(null,arguments)},ir=a._emscripten_bind_b2MouseJointDef_set_maxForce_1=function(){return (ir=a._emscripten_bind_b2MouseJointDef_set_maxForce_1=a.asm.Vo).apply(null,arguments)},jr=a._emscripten_bind_b2MouseJointDef_get_frequencyHz_0=function(){return (jr=a._emscripten_bind_b2MouseJointDef_get_frequencyHz_0=a.asm.Wo).apply(null,arguments)},
kr=a._emscripten_bind_b2MouseJointDef_set_frequencyHz_1=function(){return (kr=a._emscripten_bind_b2MouseJointDef_set_frequencyHz_1=a.asm.Xo).apply(null,arguments)},lr=a._emscripten_bind_b2MouseJointDef_get_dampingRatio_0=function(){return (lr=a._emscripten_bind_b2MouseJointDef_get_dampingRatio_0=a.asm.Yo).apply(null,arguments)},mr=a._emscripten_bind_b2MouseJointDef_set_dampingRatio_1=function(){return (mr=a._emscripten_bind_b2MouseJointDef_set_dampingRatio_1=a.asm.Zo).apply(null,arguments)},nr=a._emscripten_bind_b2MouseJointDef_get_type_0=
function(){return (nr=a._emscripten_bind_b2MouseJointDef_get_type_0=a.asm._o).apply(null,arguments)},or=a._emscripten_bind_b2MouseJointDef_set_type_1=function(){return (or=a._emscripten_bind_b2MouseJointDef_set_type_1=a.asm.$o).apply(null,arguments)},pr=a._emscripten_bind_b2MouseJointDef_get_userData_0=function(){return (pr=a._emscripten_bind_b2MouseJointDef_get_userData_0=a.asm.ap).apply(null,arguments)},qr=a._emscripten_bind_b2MouseJointDef_set_userData_1=function(){return (qr=a._emscripten_bind_b2MouseJointDef_set_userData_1=
a.asm.bp).apply(null,arguments)},rr=a._emscripten_bind_b2MouseJointDef_get_bodyA_0=function(){return (rr=a._emscripten_bind_b2MouseJointDef_get_bodyA_0=a.asm.cp).apply(null,arguments)},sr=a._emscripten_bind_b2MouseJointDef_set_bodyA_1=function(){return (sr=a._emscripten_bind_b2MouseJointDef_set_bodyA_1=a.asm.dp).apply(null,arguments)},tr=a._emscripten_bind_b2MouseJointDef_get_bodyB_0=function(){return (tr=a._emscripten_bind_b2MouseJointDef_get_bodyB_0=a.asm.ep).apply(null,arguments)},ur=a._emscripten_bind_b2MouseJointDef_set_bodyB_1=
function(){return (ur=a._emscripten_bind_b2MouseJointDef_set_bodyB_1=a.asm.fp).apply(null,arguments)},vr=a._emscripten_bind_b2MouseJointDef_get_collideConnected_0=function(){return (vr=a._emscripten_bind_b2MouseJointDef_get_collideConnected_0=a.asm.gp).apply(null,arguments)},wr=a._emscripten_bind_b2MouseJointDef_set_collideConnected_1=function(){return (wr=a._emscripten_bind_b2MouseJointDef_set_collideConnected_1=a.asm.hp).apply(null,arguments)},xr=a._emscripten_bind_b2MouseJointDef___destroy___0=function(){return (xr=
a._emscripten_bind_b2MouseJointDef___destroy___0=a.asm.ip).apply(null,arguments)},yr=a._emscripten_bind_b2Contact_GetManifold_0=function(){return (yr=a._emscripten_bind_b2Contact_GetManifold_0=a.asm.jp).apply(null,arguments)},zr=a._emscripten_bind_b2Contact_GetWorldManifold_1=function(){return (zr=a._emscripten_bind_b2Contact_GetWorldManifold_1=a.asm.kp).apply(null,arguments)},Ar=a._emscripten_bind_b2Contact_IsTouching_0=function(){return (Ar=a._emscripten_bind_b2Contact_IsTouching_0=a.asm.lp).apply(null,
arguments)},Br=a._emscripten_bind_b2Contact_SetEnabled_1=function(){return (Br=a._emscripten_bind_b2Contact_SetEnabled_1=a.asm.mp).apply(null,arguments)},Cr=a._emscripten_bind_b2Contact_IsEnabled_0=function(){return (Cr=a._emscripten_bind_b2Contact_IsEnabled_0=a.asm.np).apply(null,arguments)},Dr=a._emscripten_bind_b2Contact_GetNext_0=function(){return (Dr=a._emscripten_bind_b2Contact_GetNext_0=a.asm.op).apply(null,arguments)},Er=a._emscripten_bind_b2Contact_GetFixtureA_0=function(){return (Er=a._emscripten_bind_b2Contact_GetFixtureA_0=
a.asm.pp).apply(null,arguments)},Fr=a._emscripten_bind_b2Contact_GetChildIndexA_0=function(){return (Fr=a._emscripten_bind_b2Contact_GetChildIndexA_0=a.asm.qp).apply(null,arguments)},Gr=a._emscripten_bind_b2Contact_GetFixtureB_0=function(){return (Gr=a._emscripten_bind_b2Contact_GetFixtureB_0=a.asm.rp).apply(null,arguments)},Hr=a._emscripten_bind_b2Contact_GetChildIndexB_0=function(){return (Hr=a._emscripten_bind_b2Contact_GetChildIndexB_0=a.asm.sp).apply(null,arguments)},Ir=a._emscripten_bind_b2Contact_SetFriction_1=
function(){return (Ir=a._emscripten_bind_b2Contact_SetFriction_1=a.asm.tp).apply(null,arguments)},Jr=a._emscripten_bind_b2Contact_GetFriction_0=function(){return (Jr=a._emscripten_bind_b2Contact_GetFriction_0=a.asm.up).apply(null,arguments)},Kr=a._emscripten_bind_b2Contact_ResetFriction_0=function(){return (Kr=a._emscripten_bind_b2Contact_ResetFriction_0=a.asm.vp).apply(null,arguments)},Lr=a._emscripten_bind_b2Contact_SetRestitution_1=function(){return (Lr=a._emscripten_bind_b2Contact_SetRestitution_1=
a.asm.wp).apply(null,arguments)},Mr=a._emscripten_bind_b2Contact_GetRestitution_0=function(){return (Mr=a._emscripten_bind_b2Contact_GetRestitution_0=a.asm.xp).apply(null,arguments)},Nr=a._emscripten_bind_b2Contact_ResetRestitution_0=function(){return (Nr=a._emscripten_bind_b2Contact_ResetRestitution_0=a.asm.yp).apply(null,arguments)},Or=a._emscripten_bind_b2Contact_SetTangentSpeed_1=function(){return (Or=a._emscripten_bind_b2Contact_SetTangentSpeed_1=a.asm.zp).apply(null,arguments)},Pr=a._emscripten_bind_b2Contact_GetTangentSpeed_0=
function(){return (Pr=a._emscripten_bind_b2Contact_GetTangentSpeed_0=a.asm.Ap).apply(null,arguments)},Qr=a._emscripten_bind_b2DistanceJointDef_b2DistanceJointDef_0=function(){return (Qr=a._emscripten_bind_b2DistanceJointDef_b2DistanceJointDef_0=a.asm.Bp).apply(null,arguments)},Rr=a._emscripten_bind_b2DistanceJointDef_Initialize_4=function(){return (Rr=a._emscripten_bind_b2DistanceJointDef_Initialize_4=a.asm.Cp).apply(null,arguments)},Sr=a._emscripten_bind_b2DistanceJointDef_get_localAnchorA_0=function(){return (Sr=
a._emscripten_bind_b2DistanceJointDef_get_localAnchorA_0=a.asm.Dp).apply(null,arguments)},Tr=a._emscripten_bind_b2DistanceJointDef_set_localAnchorA_1=function(){return (Tr=a._emscripten_bind_b2DistanceJointDef_set_localAnchorA_1=a.asm.Ep).apply(null,arguments)},Ur=a._emscripten_bind_b2DistanceJointDef_get_localAnchorB_0=function(){return (Ur=a._emscripten_bind_b2DistanceJointDef_get_localAnchorB_0=a.asm.Fp).apply(null,arguments)},Vr=a._emscripten_bind_b2DistanceJointDef_set_localAnchorB_1=function(){return (Vr=
a._emscripten_bind_b2DistanceJointDef_set_localAnchorB_1=a.asm.Gp).apply(null,arguments)},Wr=a._emscripten_bind_b2DistanceJointDef_get_length_0=function(){return (Wr=a._emscripten_bind_b2DistanceJointDef_get_length_0=a.asm.Hp).apply(null,arguments)},Xr=a._emscripten_bind_b2DistanceJointDef_set_length_1=function(){return (Xr=a._emscripten_bind_b2DistanceJointDef_set_length_1=a.asm.Ip).apply(null,arguments)},Yr=a._emscripten_bind_b2DistanceJointDef_get_frequencyHz_0=function(){return (Yr=a._emscripten_bind_b2DistanceJointDef_get_frequencyHz_0=
a.asm.Jp).apply(null,arguments)},Zr=a._emscripten_bind_b2DistanceJointDef_set_frequencyHz_1=function(){return (Zr=a._emscripten_bind_b2DistanceJointDef_set_frequencyHz_1=a.asm.Kp).apply(null,arguments)},$r=a._emscripten_bind_b2DistanceJointDef_get_dampingRatio_0=function(){return ($r=a._emscripten_bind_b2DistanceJointDef_get_dampingRatio_0=a.asm.Lp).apply(null,arguments)},as=a._emscripten_bind_b2DistanceJointDef_set_dampingRatio_1=function(){return (as=a._emscripten_bind_b2DistanceJointDef_set_dampingRatio_1=
a.asm.Mp).apply(null,arguments)},bs=a._emscripten_bind_b2DistanceJointDef_get_type_0=function(){return (bs=a._emscripten_bind_b2DistanceJointDef_get_type_0=a.asm.Np).apply(null,arguments)},cs=a._emscripten_bind_b2DistanceJointDef_set_type_1=function(){return (cs=a._emscripten_bind_b2DistanceJointDef_set_type_1=a.asm.Op).apply(null,arguments)},ds=a._emscripten_bind_b2DistanceJointDef_get_userData_0=function(){return (ds=a._emscripten_bind_b2DistanceJointDef_get_userData_0=a.asm.Pp).apply(null,arguments)},
es=a._emscripten_bind_b2DistanceJointDef_set_userData_1=function(){return (es=a._emscripten_bind_b2DistanceJointDef_set_userData_1=a.asm.Qp).apply(null,arguments)},gs=a._emscripten_bind_b2DistanceJointDef_get_bodyA_0=function(){return (gs=a._emscripten_bind_b2DistanceJointDef_get_bodyA_0=a.asm.Rp).apply(null,arguments)},hs=a._emscripten_bind_b2DistanceJointDef_set_bodyA_1=function(){return (hs=a._emscripten_bind_b2DistanceJointDef_set_bodyA_1=a.asm.Sp).apply(null,arguments)},is=a._emscripten_bind_b2DistanceJointDef_get_bodyB_0=
function(){return (is=a._emscripten_bind_b2DistanceJointDef_get_bodyB_0=a.asm.Tp).apply(null,arguments)},js=a._emscripten_bind_b2DistanceJointDef_set_bodyB_1=function(){return (js=a._emscripten_bind_b2DistanceJointDef_set_bodyB_1=a.asm.Up).apply(null,arguments)},ks=a._emscripten_bind_b2DistanceJointDef_get_collideConnected_0=function(){return (ks=a._emscripten_bind_b2DistanceJointDef_get_collideConnected_0=a.asm.Vp).apply(null,arguments)},ls=a._emscripten_bind_b2DistanceJointDef_set_collideConnected_1=
function(){return (ls=a._emscripten_bind_b2DistanceJointDef_set_collideConnected_1=a.asm.Wp).apply(null,arguments)},ms=a._emscripten_bind_b2DistanceJointDef___destroy___0=function(){return (ms=a._emscripten_bind_b2DistanceJointDef___destroy___0=a.asm.Xp).apply(null,arguments)},ns=a._emscripten_bind_b2Body_CreateFixture_1=function(){return (ns=a._emscripten_bind_b2Body_CreateFixture_1=a.asm.Yp).apply(null,arguments)},ps=a._emscripten_bind_b2Body_CreateFixture_2=function(){return (ps=a._emscripten_bind_b2Body_CreateFixture_2=
a.asm.Zp).apply(null,arguments)},qs=a._emscripten_bind_b2Body_DestroyFixture_1=function(){return (qs=a._emscripten_bind_b2Body_DestroyFixture_1=a.asm._p).apply(null,arguments)},rs=a._emscripten_bind_b2Body_SetTransform_2=function(){return (rs=a._emscripten_bind_b2Body_SetTransform_2=a.asm.$p).apply(null,arguments)},ss=a._emscripten_bind_b2Body_GetTransform_0=function(){return (ss=a._emscripten_bind_b2Body_GetTransform_0=a.asm.aq).apply(null,arguments)},ts=a._emscripten_bind_b2Body_GetPosition_0=function(){return (ts=
a._emscripten_bind_b2Body_GetPosition_0=a.asm.bq).apply(null,arguments)},us=a._emscripten_bind_b2Body_GetAngle_0=function(){return (us=a._emscripten_bind_b2Body_GetAngle_0=a.asm.cq).apply(null,arguments)},vs=a._emscripten_bind_b2Body_GetWorldCenter_0=function(){return (vs=a._emscripten_bind_b2Body_GetWorldCenter_0=a.asm.dq).apply(null,arguments)},xs=a._emscripten_bind_b2Body_GetLocalCenter_0=function(){return (xs=a._emscripten_bind_b2Body_GetLocalCenter_0=a.asm.eq).apply(null,arguments)},ys=a._emscripten_bind_b2Body_SetLinearVelocity_1=
function(){return (ys=a._emscripten_bind_b2Body_SetLinearVelocity_1=a.asm.fq).apply(null,arguments)},zs=a._emscripten_bind_b2Body_GetLinearVelocity_0=function(){return (zs=a._emscripten_bind_b2Body_GetLinearVelocity_0=a.asm.gq).apply(null,arguments)},As=a._emscripten_bind_b2Body_SetAngularVelocity_1=function(){return (As=a._emscripten_bind_b2Body_SetAngularVelocity_1=a.asm.hq).apply(null,arguments)},Bs=a._emscripten_bind_b2Body_GetAngularVelocity_0=function(){return (Bs=a._emscripten_bind_b2Body_GetAngularVelocity_0=
a.asm.iq).apply(null,arguments)},Cs=a._emscripten_bind_b2Body_ApplyForce_3=function(){return (Cs=a._emscripten_bind_b2Body_ApplyForce_3=a.asm.jq).apply(null,arguments)},Ds=a._emscripten_bind_b2Body_ApplyForceToCenter_2=function(){return (Ds=a._emscripten_bind_b2Body_ApplyForceToCenter_2=a.asm.kq).apply(null,arguments)},Es=a._emscripten_bind_b2Body_ApplyTorque_2=function(){return (Es=a._emscripten_bind_b2Body_ApplyTorque_2=a.asm.lq).apply(null,arguments)},Fs=a._emscripten_bind_b2Body_ApplyLinearImpulse_3=
function(){return (Fs=a._emscripten_bind_b2Body_ApplyLinearImpulse_3=a.asm.mq).apply(null,arguments)},Gs=a._emscripten_bind_b2Body_ApplyAngularImpulse_2=function(){return (Gs=a._emscripten_bind_b2Body_ApplyAngularImpulse_2=a.asm.nq).apply(null,arguments)},Hs=a._emscripten_bind_b2Body_GetMass_0=function(){return (Hs=a._emscripten_bind_b2Body_GetMass_0=a.asm.oq).apply(null,arguments)},Is=a._emscripten_bind_b2Body_GetInertia_0=function(){return (Is=a._emscripten_bind_b2Body_GetInertia_0=a.asm.pq).apply(null,
arguments)},Js=a._emscripten_bind_b2Body_GetMassData_1=function(){return (Js=a._emscripten_bind_b2Body_GetMassData_1=a.asm.qq).apply(null,arguments)},Ks=a._emscripten_bind_b2Body_SetMassData_1=function(){return (Ks=a._emscripten_bind_b2Body_SetMassData_1=a.asm.rq).apply(null,arguments)},Ls=a._emscripten_bind_b2Body_ResetMassData_0=function(){return (Ls=a._emscripten_bind_b2Body_ResetMassData_0=a.asm.sq).apply(null,arguments)},Ms=a._emscripten_bind_b2Body_GetWorldPoint_1=function(){return (Ms=a._emscripten_bind_b2Body_GetWorldPoint_1=
a.asm.tq).apply(null,arguments)},Ns=a._emscripten_bind_b2Body_GetWorldVector_1=function(){return (Ns=a._emscripten_bind_b2Body_GetWorldVector_1=a.asm.uq).apply(null,arguments)},Os=a._emscripten_bind_b2Body_GetLocalPoint_1=function(){return (Os=a._emscripten_bind_b2Body_GetLocalPoint_1=a.asm.vq).apply(null,arguments)},Ps=a._emscripten_bind_b2Body_GetLocalVector_1=function(){return (Ps=a._emscripten_bind_b2Body_GetLocalVector_1=a.asm.wq).apply(null,arguments)},Qs=a._emscripten_bind_b2Body_GetLinearVelocityFromWorldPoint_1=
function(){return (Qs=a._emscripten_bind_b2Body_GetLinearVelocityFromWorldPoint_1=a.asm.xq).apply(null,arguments)},Rs=a._emscripten_bind_b2Body_GetLinearVelocityFromLocalPoint_1=function(){return (Rs=a._emscripten_bind_b2Body_GetLinearVelocityFromLocalPoint_1=a.asm.yq).apply(null,arguments)},Ss=a._emscripten_bind_b2Body_GetLinearDamping_0=function(){return (Ss=a._emscripten_bind_b2Body_GetLinearDamping_0=a.asm.zq).apply(null,arguments)},Ts=a._emscripten_bind_b2Body_SetLinearDamping_1=function(){return (Ts=
a._emscripten_bind_b2Body_SetLinearDamping_1=a.asm.Aq).apply(null,arguments)},Us=a._emscripten_bind_b2Body_GetAngularDamping_0=function(){return (Us=a._emscripten_bind_b2Body_GetAngularDamping_0=a.asm.Bq).apply(null,arguments)},Vs=a._emscripten_bind_b2Body_SetAngularDamping_1=function(){return (Vs=a._emscripten_bind_b2Body_SetAngularDamping_1=a.asm.Cq).apply(null,arguments)},Ws=a._emscripten_bind_b2Body_GetGravityScale_0=function(){return (Ws=a._emscripten_bind_b2Body_GetGravityScale_0=a.asm.Dq).apply(null,
arguments)},Xs=a._emscripten_bind_b2Body_SetGravityScale_1=function(){return (Xs=a._emscripten_bind_b2Body_SetGravityScale_1=a.asm.Eq).apply(null,arguments)},Ys=a._emscripten_bind_b2Body_SetType_1=function(){return (Ys=a._emscripten_bind_b2Body_SetType_1=a.asm.Fq).apply(null,arguments)},Zs=a._emscripten_bind_b2Body_GetType_0=function(){return (Zs=a._emscripten_bind_b2Body_GetType_0=a.asm.Gq).apply(null,arguments)},$s=a._emscripten_bind_b2Body_SetBullet_1=function(){return ($s=a._emscripten_bind_b2Body_SetBullet_1=
a.asm.Hq).apply(null,arguments)},at=a._emscripten_bind_b2Body_IsBullet_0=function(){return (at=a._emscripten_bind_b2Body_IsBullet_0=a.asm.Iq).apply(null,arguments)},bt=a._emscripten_bind_b2Body_SetSleepingAllowed_1=function(){return (bt=a._emscripten_bind_b2Body_SetSleepingAllowed_1=a.asm.Jq).apply(null,arguments)},ct=a._emscripten_bind_b2Body_IsSleepingAllowed_0=function(){return (ct=a._emscripten_bind_b2Body_IsSleepingAllowed_0=a.asm.Kq).apply(null,arguments)},dt=a._emscripten_bind_b2Body_SetAwake_1=
function(){return (dt=a._emscripten_bind_b2Body_SetAwake_1=a.asm.Lq).apply(null,arguments)},et=a._emscripten_bind_b2Body_IsAwake_0=function(){return (et=a._emscripten_bind_b2Body_IsAwake_0=a.asm.Mq).apply(null,arguments)},ft=a._emscripten_bind_b2Body_SetActive_1=function(){return (ft=a._emscripten_bind_b2Body_SetActive_1=a.asm.Nq).apply(null,arguments)},gt=a._emscripten_bind_b2Body_IsActive_0=function(){return (gt=a._emscripten_bind_b2Body_IsActive_0=a.asm.Oq).apply(null,arguments)},ht=a._emscripten_bind_b2Body_SetFixedRotation_1=
function(){return (ht=a._emscripten_bind_b2Body_SetFixedRotation_1=a.asm.Pq).apply(null,arguments)},it=a._emscripten_bind_b2Body_IsFixedRotation_0=function(){return (it=a._emscripten_bind_b2Body_IsFixedRotation_0=a.asm.Qq).apply(null,arguments)},jt=a._emscripten_bind_b2Body_GetFixtureList_0=function(){return (jt=a._emscripten_bind_b2Body_GetFixtureList_0=a.asm.Rq).apply(null,arguments)},kt=a._emscripten_bind_b2Body_GetJointList_0=function(){return (kt=a._emscripten_bind_b2Body_GetJointList_0=a.asm.Sq).apply(null,
arguments)},lt=a._emscripten_bind_b2Body_GetContactList_0=function(){return (lt=a._emscripten_bind_b2Body_GetContactList_0=a.asm.Tq).apply(null,arguments)},mt=a._emscripten_bind_b2Body_GetNext_0=function(){return (mt=a._emscripten_bind_b2Body_GetNext_0=a.asm.Uq).apply(null,arguments)},nt=a._emscripten_bind_b2Body_GetUserData_0=function(){return (nt=a._emscripten_bind_b2Body_GetUserData_0=a.asm.Vq).apply(null,arguments)},ot=a._emscripten_bind_b2Body_SetUserData_1=function(){return (ot=a._emscripten_bind_b2Body_SetUserData_1=
a.asm.Wq).apply(null,arguments)},pt=a._emscripten_bind_b2Body_GetWorld_0=function(){return (pt=a._emscripten_bind_b2Body_GetWorld_0=a.asm.Xq).apply(null,arguments)},qt=a._emscripten_bind_b2Body_Dump_0=function(){return (qt=a._emscripten_bind_b2Body_Dump_0=a.asm.Yq).apply(null,arguments)},rt=a._emscripten_bind_b2FrictionJoint_GetLocalAnchorA_0=function(){return (rt=a._emscripten_bind_b2FrictionJoint_GetLocalAnchorA_0=a.asm.Zq).apply(null,arguments)},st=a._emscripten_bind_b2FrictionJoint_GetLocalAnchorB_0=
function(){return (st=a._emscripten_bind_b2FrictionJoint_GetLocalAnchorB_0=a.asm._q).apply(null,arguments)},tt=a._emscripten_bind_b2FrictionJoint_SetMaxForce_1=function(){return (tt=a._emscripten_bind_b2FrictionJoint_SetMaxForce_1=a.asm.$q).apply(null,arguments)},ut=a._emscripten_bind_b2FrictionJoint_GetMaxForce_0=function(){return (ut=a._emscripten_bind_b2FrictionJoint_GetMaxForce_0=a.asm.ar).apply(null,arguments)},vt=a._emscripten_bind_b2FrictionJoint_SetMaxTorque_1=function(){return (vt=a._emscripten_bind_b2FrictionJoint_SetMaxTorque_1=
a.asm.br).apply(null,arguments)},wt=a._emscripten_bind_b2FrictionJoint_GetMaxTorque_0=function(){return (wt=a._emscripten_bind_b2FrictionJoint_GetMaxTorque_0=a.asm.cr).apply(null,arguments)},xt=a._emscripten_bind_b2FrictionJoint_GetType_0=function(){return (xt=a._emscripten_bind_b2FrictionJoint_GetType_0=a.asm.dr).apply(null,arguments)},yt=a._emscripten_bind_b2FrictionJoint_GetBodyA_0=function(){return (yt=a._emscripten_bind_b2FrictionJoint_GetBodyA_0=a.asm.er).apply(null,arguments)},zt=a._emscripten_bind_b2FrictionJoint_GetBodyB_0=
function(){return (zt=a._emscripten_bind_b2FrictionJoint_GetBodyB_0=a.asm.fr).apply(null,arguments)},At=a._emscripten_bind_b2FrictionJoint_GetAnchorA_0=function(){return (At=a._emscripten_bind_b2FrictionJoint_GetAnchorA_0=a.asm.gr).apply(null,arguments)},Bt=a._emscripten_bind_b2FrictionJoint_GetAnchorB_0=function(){return (Bt=a._emscripten_bind_b2FrictionJoint_GetAnchorB_0=a.asm.hr).apply(null,arguments)},Ct=a._emscripten_bind_b2FrictionJoint_GetReactionForce_1=function(){return (Ct=a._emscripten_bind_b2FrictionJoint_GetReactionForce_1=
a.asm.ir).apply(null,arguments)},Dt=a._emscripten_bind_b2FrictionJoint_GetReactionTorque_1=function(){return (Dt=a._emscripten_bind_b2FrictionJoint_GetReactionTorque_1=a.asm.jr).apply(null,arguments)},Et=a._emscripten_bind_b2FrictionJoint_GetNext_0=function(){return (Et=a._emscripten_bind_b2FrictionJoint_GetNext_0=a.asm.kr).apply(null,arguments)},Ft=a._emscripten_bind_b2FrictionJoint_GetUserData_0=function(){return (Ft=a._emscripten_bind_b2FrictionJoint_GetUserData_0=a.asm.lr).apply(null,arguments)},
Gt=a._emscripten_bind_b2FrictionJoint_SetUserData_1=function(){return (Gt=a._emscripten_bind_b2FrictionJoint_SetUserData_1=a.asm.mr).apply(null,arguments)},Ht=a._emscripten_bind_b2FrictionJoint_IsActive_0=function(){return (Ht=a._emscripten_bind_b2FrictionJoint_IsActive_0=a.asm.nr).apply(null,arguments)},It=a._emscripten_bind_b2FrictionJoint_GetCollideConnected_0=function(){return (It=a._emscripten_bind_b2FrictionJoint_GetCollideConnected_0=a.asm.or).apply(null,arguments)},Jt=a._emscripten_bind_b2FrictionJoint___destroy___0=
function(){return (Jt=a._emscripten_bind_b2FrictionJoint___destroy___0=a.asm.pr).apply(null,arguments)},Kt=a._emscripten_bind_b2DestructionListener___destroy___0=function(){return (Kt=a._emscripten_bind_b2DestructionListener___destroy___0=a.asm.qr).apply(null,arguments)},Lt=a._emscripten_bind_b2GearJointDef_b2GearJointDef_0=function(){return (Lt=a._emscripten_bind_b2GearJointDef_b2GearJointDef_0=a.asm.rr).apply(null,arguments)},Mt=a._emscripten_bind_b2GearJointDef_get_joint1_0=function(){return (Mt=a._emscripten_bind_b2GearJointDef_get_joint1_0=
a.asm.sr).apply(null,arguments)},Nt=a._emscripten_bind_b2GearJointDef_set_joint1_1=function(){return (Nt=a._emscripten_bind_b2GearJointDef_set_joint1_1=a.asm.tr).apply(null,arguments)},Ot=a._emscripten_bind_b2GearJointDef_get_joint2_0=function(){return (Ot=a._emscripten_bind_b2GearJointDef_get_joint2_0=a.asm.ur).apply(null,arguments)},Pt=a._emscripten_bind_b2GearJointDef_set_joint2_1=function(){return (Pt=a._emscripten_bind_b2GearJointDef_set_joint2_1=a.asm.vr).apply(null,arguments)},Qt=a._emscripten_bind_b2GearJointDef_get_ratio_0=
function(){return (Qt=a._emscripten_bind_b2GearJointDef_get_ratio_0=a.asm.wr).apply(null,arguments)},Rt=a._emscripten_bind_b2GearJointDef_set_ratio_1=function(){return (Rt=a._emscripten_bind_b2GearJointDef_set_ratio_1=a.asm.xr).apply(null,arguments)},St=a._emscripten_bind_b2GearJointDef_get_type_0=function(){return (St=a._emscripten_bind_b2GearJointDef_get_type_0=a.asm.yr).apply(null,arguments)},Tt=a._emscripten_bind_b2GearJointDef_set_type_1=function(){return (Tt=a._emscripten_bind_b2GearJointDef_set_type_1=
a.asm.zr).apply(null,arguments)},Ut=a._emscripten_bind_b2GearJointDef_get_userData_0=function(){return (Ut=a._emscripten_bind_b2GearJointDef_get_userData_0=a.asm.Ar).apply(null,arguments)},Vt=a._emscripten_bind_b2GearJointDef_set_userData_1=function(){return (Vt=a._emscripten_bind_b2GearJointDef_set_userData_1=a.asm.Br).apply(null,arguments)},Wt=a._emscripten_bind_b2GearJointDef_get_bodyA_0=function(){return (Wt=a._emscripten_bind_b2GearJointDef_get_bodyA_0=a.asm.Cr).apply(null,arguments)},Xt=a._emscripten_bind_b2GearJointDef_set_bodyA_1=
function(){return (Xt=a._emscripten_bind_b2GearJointDef_set_bodyA_1=a.asm.Dr).apply(null,arguments)},Yt=a._emscripten_bind_b2GearJointDef_get_bodyB_0=function(){return (Yt=a._emscripten_bind_b2GearJointDef_get_bodyB_0=a.asm.Er).apply(null,arguments)},Zt=a._emscripten_bind_b2GearJointDef_set_bodyB_1=function(){return (Zt=a._emscripten_bind_b2GearJointDef_set_bodyB_1=a.asm.Fr).apply(null,arguments)},$t=a._emscripten_bind_b2GearJointDef_get_collideConnected_0=function(){return ($t=a._emscripten_bind_b2GearJointDef_get_collideConnected_0=
a.asm.Gr).apply(null,arguments)},au=a._emscripten_bind_b2GearJointDef_set_collideConnected_1=function(){return (au=a._emscripten_bind_b2GearJointDef_set_collideConnected_1=a.asm.Hr).apply(null,arguments)},bu=a._emscripten_bind_b2GearJointDef___destroy___0=function(){return (bu=a._emscripten_bind_b2GearJointDef___destroy___0=a.asm.Ir).apply(null,arguments)},cu=a._emscripten_bind_b2RevoluteJoint_GetLocalAnchorA_0=function(){return (cu=a._emscripten_bind_b2RevoluteJoint_GetLocalAnchorA_0=a.asm.Jr).apply(null,
arguments)},du=a._emscripten_bind_b2RevoluteJoint_GetLocalAnchorB_0=function(){return (du=a._emscripten_bind_b2RevoluteJoint_GetLocalAnchorB_0=a.asm.Kr).apply(null,arguments)},eu=a._emscripten_bind_b2RevoluteJoint_GetReferenceAngle_0=function(){return (eu=a._emscripten_bind_b2RevoluteJoint_GetReferenceAngle_0=a.asm.Lr).apply(null,arguments)},fu=a._emscripten_bind_b2RevoluteJoint_GetJointAngle_0=function(){return (fu=a._emscripten_bind_b2RevoluteJoint_GetJointAngle_0=a.asm.Mr).apply(null,arguments)},
gu=a._emscripten_bind_b2RevoluteJoint_GetJointSpeed_0=function(){return (gu=a._emscripten_bind_b2RevoluteJoint_GetJointSpeed_0=a.asm.Nr).apply(null,arguments)},hu=a._emscripten_bind_b2RevoluteJoint_IsLimitEnabled_0=function(){return (hu=a._emscripten_bind_b2RevoluteJoint_IsLimitEnabled_0=a.asm.Or).apply(null,arguments)},iu=a._emscripten_bind_b2RevoluteJoint_EnableLimit_1=function(){return (iu=a._emscripten_bind_b2RevoluteJoint_EnableLimit_1=a.asm.Pr).apply(null,arguments)},ju=a._emscripten_bind_b2RevoluteJoint_GetLowerLimit_0=
function(){return (ju=a._emscripten_bind_b2RevoluteJoint_GetLowerLimit_0=a.asm.Qr).apply(null,arguments)},ku=a._emscripten_bind_b2RevoluteJoint_GetUpperLimit_0=function(){return (ku=a._emscripten_bind_b2RevoluteJoint_GetUpperLimit_0=a.asm.Rr).apply(null,arguments)},lu=a._emscripten_bind_b2RevoluteJoint_SetLimits_2=function(){return (lu=a._emscripten_bind_b2RevoluteJoint_SetLimits_2=a.asm.Sr).apply(null,arguments)},mu=a._emscripten_bind_b2RevoluteJoint_IsMotorEnabled_0=function(){return (mu=a._emscripten_bind_b2RevoluteJoint_IsMotorEnabled_0=
a.asm.Tr).apply(null,arguments)},nu=a._emscripten_bind_b2RevoluteJoint_EnableMotor_1=function(){return (nu=a._emscripten_bind_b2RevoluteJoint_EnableMotor_1=a.asm.Ur).apply(null,arguments)},ou=a._emscripten_bind_b2RevoluteJoint_SetMotorSpeed_1=function(){return (ou=a._emscripten_bind_b2RevoluteJoint_SetMotorSpeed_1=a.asm.Vr).apply(null,arguments)},pu=a._emscripten_bind_b2RevoluteJoint_GetMotorSpeed_0=function(){return (pu=a._emscripten_bind_b2RevoluteJoint_GetMotorSpeed_0=a.asm.Wr).apply(null,arguments)},
qu=a._emscripten_bind_b2RevoluteJoint_SetMaxMotorTorque_1=function(){return (qu=a._emscripten_bind_b2RevoluteJoint_SetMaxMotorTorque_1=a.asm.Xr).apply(null,arguments)},ru=a._emscripten_bind_b2RevoluteJoint_GetMaxMotorTorque_0=function(){return (ru=a._emscripten_bind_b2RevoluteJoint_GetMaxMotorTorque_0=a.asm.Yr).apply(null,arguments)},su=a._emscripten_bind_b2RevoluteJoint_GetMotorTorque_1=function(){return (su=a._emscripten_bind_b2RevoluteJoint_GetMotorTorque_1=a.asm.Zr).apply(null,arguments)},tu=a._emscripten_bind_b2RevoluteJoint_GetType_0=
function(){return (tu=a._emscripten_bind_b2RevoluteJoint_GetType_0=a.asm._r).apply(null,arguments)},uu=a._emscripten_bind_b2RevoluteJoint_GetBodyA_0=function(){return (uu=a._emscripten_bind_b2RevoluteJoint_GetBodyA_0=a.asm.$r).apply(null,arguments)},vu=a._emscripten_bind_b2RevoluteJoint_GetBodyB_0=function(){return (vu=a._emscripten_bind_b2RevoluteJoint_GetBodyB_0=a.asm.as).apply(null,arguments)},wu=a._emscripten_bind_b2RevoluteJoint_GetAnchorA_0=function(){return (wu=a._emscripten_bind_b2RevoluteJoint_GetAnchorA_0=
a.asm.bs).apply(null,arguments)},xu=a._emscripten_bind_b2RevoluteJoint_GetAnchorB_0=function(){return (xu=a._emscripten_bind_b2RevoluteJoint_GetAnchorB_0=a.asm.cs).apply(null,arguments)},yu=a._emscripten_bind_b2RevoluteJoint_GetReactionForce_1=function(){return (yu=a._emscripten_bind_b2RevoluteJoint_GetReactionForce_1=a.asm.ds).apply(null,arguments)},zu=a._emscripten_bind_b2RevoluteJoint_GetReactionTorque_1=function(){return (zu=a._emscripten_bind_b2RevoluteJoint_GetReactionTorque_1=a.asm.es).apply(null,
arguments)},Au=a._emscripten_bind_b2RevoluteJoint_GetNext_0=function(){return (Au=a._emscripten_bind_b2RevoluteJoint_GetNext_0=a.asm.fs).apply(null,arguments)},Bu=a._emscripten_bind_b2RevoluteJoint_GetUserData_0=function(){return (Bu=a._emscripten_bind_b2RevoluteJoint_GetUserData_0=a.asm.gs).apply(null,arguments)},Cu=a._emscripten_bind_b2RevoluteJoint_SetUserData_1=function(){return (Cu=a._emscripten_bind_b2RevoluteJoint_SetUserData_1=a.asm.hs).apply(null,arguments)},Du=a._emscripten_bind_b2RevoluteJoint_IsActive_0=
function(){return (Du=a._emscripten_bind_b2RevoluteJoint_IsActive_0=a.asm.is).apply(null,arguments)},Eu=a._emscripten_bind_b2RevoluteJoint_GetCollideConnected_0=function(){return (Eu=a._emscripten_bind_b2RevoluteJoint_GetCollideConnected_0=a.asm.js).apply(null,arguments)},Fu=a._emscripten_bind_b2RevoluteJoint___destroy___0=function(){return (Fu=a._emscripten_bind_b2RevoluteJoint___destroy___0=a.asm.ks).apply(null,arguments)},Gu=a._emscripten_bind_b2ContactEdge_b2ContactEdge_0=function(){return (Gu=a._emscripten_bind_b2ContactEdge_b2ContactEdge_0=
a.asm.ls).apply(null,arguments)},Hu=a._emscripten_bind_b2ContactEdge_get_other_0=function(){return (Hu=a._emscripten_bind_b2ContactEdge_get_other_0=a.asm.ms).apply(null,arguments)},Iu=a._emscripten_bind_b2ContactEdge_set_other_1=function(){return (Iu=a._emscripten_bind_b2ContactEdge_set_other_1=a.asm.ns).apply(null,arguments)},Ju=a._emscripten_bind_b2ContactEdge_get_contact_0=function(){return (Ju=a._emscripten_bind_b2ContactEdge_get_contact_0=a.asm.os).apply(null,arguments)},Ku=a._emscripten_bind_b2ContactEdge_set_contact_1=
function(){return (Ku=a._emscripten_bind_b2ContactEdge_set_contact_1=a.asm.ps).apply(null,arguments)},Lu=a._emscripten_bind_b2ContactEdge_get_prev_0=function(){return (Lu=a._emscripten_bind_b2ContactEdge_get_prev_0=a.asm.qs).apply(null,arguments)},Mu=a._emscripten_bind_b2ContactEdge_set_prev_1=function(){return (Mu=a._emscripten_bind_b2ContactEdge_set_prev_1=a.asm.rs).apply(null,arguments)},Nu=a._emscripten_bind_b2ContactEdge_get_next_0=function(){return (Nu=a._emscripten_bind_b2ContactEdge_get_next_0=
a.asm.ss).apply(null,arguments)},Ou=a._emscripten_bind_b2ContactEdge_set_next_1=function(){return (Ou=a._emscripten_bind_b2ContactEdge_set_next_1=a.asm.ts).apply(null,arguments)},Pu=a._emscripten_bind_b2ContactEdge___destroy___0=function(){return (Pu=a._emscripten_bind_b2ContactEdge___destroy___0=a.asm.us).apply(null,arguments)},Qu=a._emscripten_bind_b2RopeJointDef_b2RopeJointDef_0=function(){return (Qu=a._emscripten_bind_b2RopeJointDef_b2RopeJointDef_0=a.asm.vs).apply(null,arguments)},Ru=a._emscripten_bind_b2RopeJointDef_get_localAnchorA_0=
function(){return (Ru=a._emscripten_bind_b2RopeJointDef_get_localAnchorA_0=a.asm.ws).apply(null,arguments)},Su=a._emscripten_bind_b2RopeJointDef_set_localAnchorA_1=function(){return (Su=a._emscripten_bind_b2RopeJointDef_set_localAnchorA_1=a.asm.xs).apply(null,arguments)},Tu=a._emscripten_bind_b2RopeJointDef_get_localAnchorB_0=function(){return (Tu=a._emscripten_bind_b2RopeJointDef_get_localAnchorB_0=a.asm.ys).apply(null,arguments)},Uu=a._emscripten_bind_b2RopeJointDef_set_localAnchorB_1=function(){return (Uu=
a._emscripten_bind_b2RopeJointDef_set_localAnchorB_1=a.asm.zs).apply(null,arguments)},Vu=a._emscripten_bind_b2RopeJointDef_get_maxLength_0=function(){return (Vu=a._emscripten_bind_b2RopeJointDef_get_maxLength_0=a.asm.As).apply(null,arguments)},Wu=a._emscripten_bind_b2RopeJointDef_set_maxLength_1=function(){return (Wu=a._emscripten_bind_b2RopeJointDef_set_maxLength_1=a.asm.Bs).apply(null,arguments)},Xu=a._emscripten_bind_b2RopeJointDef_get_type_0=function(){return (Xu=a._emscripten_bind_b2RopeJointDef_get_type_0=
a.asm.Cs).apply(null,arguments)},Yu=a._emscripten_bind_b2RopeJointDef_set_type_1=function(){return (Yu=a._emscripten_bind_b2RopeJointDef_set_type_1=a.asm.Ds).apply(null,arguments)},Zu=a._emscripten_bind_b2RopeJointDef_get_userData_0=function(){return (Zu=a._emscripten_bind_b2RopeJointDef_get_userData_0=a.asm.Es).apply(null,arguments)},$u=a._emscripten_bind_b2RopeJointDef_set_userData_1=function(){return ($u=a._emscripten_bind_b2RopeJointDef_set_userData_1=a.asm.Fs).apply(null,arguments)},av=a._emscripten_bind_b2RopeJointDef_get_bodyA_0=
function(){return (av=a._emscripten_bind_b2RopeJointDef_get_bodyA_0=a.asm.Gs).apply(null,arguments)},bv=a._emscripten_bind_b2RopeJointDef_set_bodyA_1=function(){return (bv=a._emscripten_bind_b2RopeJointDef_set_bodyA_1=a.asm.Hs).apply(null,arguments)},cv=a._emscripten_bind_b2RopeJointDef_get_bodyB_0=function(){return (cv=a._emscripten_bind_b2RopeJointDef_get_bodyB_0=a.asm.Is).apply(null,arguments)},dv=a._emscripten_bind_b2RopeJointDef_set_bodyB_1=function(){return (dv=a._emscripten_bind_b2RopeJointDef_set_bodyB_1=
a.asm.Js).apply(null,arguments)},ev=a._emscripten_bind_b2RopeJointDef_get_collideConnected_0=function(){return (ev=a._emscripten_bind_b2RopeJointDef_get_collideConnected_0=a.asm.Ks).apply(null,arguments)},fv=a._emscripten_bind_b2RopeJointDef_set_collideConnected_1=function(){return (fv=a._emscripten_bind_b2RopeJointDef_set_collideConnected_1=a.asm.Ls).apply(null,arguments)},gv=a._emscripten_bind_b2RopeJointDef___destroy___0=function(){return (gv=a._emscripten_bind_b2RopeJointDef___destroy___0=a.asm.Ms).apply(null,
arguments)},hv=a._emscripten_bind_b2MotorJointDef_b2MotorJointDef_0=function(){return (hv=a._emscripten_bind_b2MotorJointDef_b2MotorJointDef_0=a.asm.Ns).apply(null,arguments)},iv=a._emscripten_bind_b2MotorJointDef_Initialize_2=function(){return (iv=a._emscripten_bind_b2MotorJointDef_Initialize_2=a.asm.Os).apply(null,arguments)},jv=a._emscripten_bind_b2MotorJointDef_get_linearOffset_0=function(){return (jv=a._emscripten_bind_b2MotorJointDef_get_linearOffset_0=a.asm.Ps).apply(null,arguments)},kv=a._emscripten_bind_b2MotorJointDef_set_linearOffset_1=
function(){return (kv=a._emscripten_bind_b2MotorJointDef_set_linearOffset_1=a.asm.Qs).apply(null,arguments)},lv=a._emscripten_bind_b2MotorJointDef_get_angularOffset_0=function(){return (lv=a._emscripten_bind_b2MotorJointDef_get_angularOffset_0=a.asm.Rs).apply(null,arguments)},mv=a._emscripten_bind_b2MotorJointDef_set_angularOffset_1=function(){return (mv=a._emscripten_bind_b2MotorJointDef_set_angularOffset_1=a.asm.Ss).apply(null,arguments)},nv=a._emscripten_bind_b2MotorJointDef_get_maxForce_0=function(){return (nv=
a._emscripten_bind_b2MotorJointDef_get_maxForce_0=a.asm.Ts).apply(null,arguments)},ov=a._emscripten_bind_b2MotorJointDef_set_maxForce_1=function(){return (ov=a._emscripten_bind_b2MotorJointDef_set_maxForce_1=a.asm.Us).apply(null,arguments)},pv=a._emscripten_bind_b2MotorJointDef_get_maxTorque_0=function(){return (pv=a._emscripten_bind_b2MotorJointDef_get_maxTorque_0=a.asm.Vs).apply(null,arguments)},qv=a._emscripten_bind_b2MotorJointDef_set_maxTorque_1=function(){return (qv=a._emscripten_bind_b2MotorJointDef_set_maxTorque_1=
a.asm.Ws).apply(null,arguments)},rv=a._emscripten_bind_b2MotorJointDef_get_correctionFactor_0=function(){return (rv=a._emscripten_bind_b2MotorJointDef_get_correctionFactor_0=a.asm.Xs).apply(null,arguments)},sv=a._emscripten_bind_b2MotorJointDef_set_correctionFactor_1=function(){return (sv=a._emscripten_bind_b2MotorJointDef_set_correctionFactor_1=a.asm.Ys).apply(null,arguments)},tv=a._emscripten_bind_b2MotorJointDef_get_type_0=function(){return (tv=a._emscripten_bind_b2MotorJointDef_get_type_0=a.asm.Zs).apply(null,
arguments)},uv=a._emscripten_bind_b2MotorJointDef_set_type_1=function(){return (uv=a._emscripten_bind_b2MotorJointDef_set_type_1=a.asm._s).apply(null,arguments)},vv=a._emscripten_bind_b2MotorJointDef_get_userData_0=function(){return (vv=a._emscripten_bind_b2MotorJointDef_get_userData_0=a.asm.$s).apply(null,arguments)},wv=a._emscripten_bind_b2MotorJointDef_set_userData_1=function(){return (wv=a._emscripten_bind_b2MotorJointDef_set_userData_1=a.asm.at).apply(null,arguments)},xv=a._emscripten_bind_b2MotorJointDef_get_bodyA_0=
function(){return (xv=a._emscripten_bind_b2MotorJointDef_get_bodyA_0=a.asm.bt).apply(null,arguments)},yv=a._emscripten_bind_b2MotorJointDef_set_bodyA_1=function(){return (yv=a._emscripten_bind_b2MotorJointDef_set_bodyA_1=a.asm.ct).apply(null,arguments)},zv=a._emscripten_bind_b2MotorJointDef_get_bodyB_0=function(){return (zv=a._emscripten_bind_b2MotorJointDef_get_bodyB_0=a.asm.dt).apply(null,arguments)},Av=a._emscripten_bind_b2MotorJointDef_set_bodyB_1=function(){return (Av=a._emscripten_bind_b2MotorJointDef_set_bodyB_1=
a.asm.et).apply(null,arguments)},Bv=a._emscripten_bind_b2MotorJointDef_get_collideConnected_0=function(){return (Bv=a._emscripten_bind_b2MotorJointDef_get_collideConnected_0=a.asm.ft).apply(null,arguments)},Cv=a._emscripten_bind_b2MotorJointDef_set_collideConnected_1=function(){return (Cv=a._emscripten_bind_b2MotorJointDef_set_collideConnected_1=a.asm.gt).apply(null,arguments)},Dv=a._emscripten_bind_b2MotorJointDef___destroy___0=function(){return (Dv=a._emscripten_bind_b2MotorJointDef___destroy___0=
a.asm.ht).apply(null,arguments)},Ev=a._emscripten_enum_b2ShapeType_e_circle=function(){return (Ev=a._emscripten_enum_b2ShapeType_e_circle=a.asm.it).apply(null,arguments)},Fv=a._emscripten_enum_b2ShapeType_e_edge=function(){return (Fv=a._emscripten_enum_b2ShapeType_e_edge=a.asm.jt).apply(null,arguments)},Gv=a._emscripten_enum_b2ShapeType_e_polygon=function(){return (Gv=a._emscripten_enum_b2ShapeType_e_polygon=a.asm.kt).apply(null,arguments)},Hv=a._emscripten_enum_b2ShapeType_e_chain=function(){return (Hv=
a._emscripten_enum_b2ShapeType_e_chain=a.asm.lt).apply(null,arguments)},Iv=a._emscripten_enum_b2ShapeType_e_typeCount=function(){return (Iv=a._emscripten_enum_b2ShapeType_e_typeCount=a.asm.mt).apply(null,arguments)},Jv=a._emscripten_enum_b2JointType_e_unknownJoint=function(){return (Jv=a._emscripten_enum_b2JointType_e_unknownJoint=a.asm.nt).apply(null,arguments)},Kv=a._emscripten_enum_b2JointType_e_revoluteJoint=function(){return (Kv=a._emscripten_enum_b2JointType_e_revoluteJoint=a.asm.ot).apply(null,
arguments)},Lv=a._emscripten_enum_b2JointType_e_prismaticJoint=function(){return (Lv=a._emscripten_enum_b2JointType_e_prismaticJoint=a.asm.pt).apply(null,arguments)},Mv=a._emscripten_enum_b2JointType_e_distanceJoint=function(){return (Mv=a._emscripten_enum_b2JointType_e_distanceJoint=a.asm.qt).apply(null,arguments)},Nv=a._emscripten_enum_b2JointType_e_pulleyJoint=function(){return (Nv=a._emscripten_enum_b2JointType_e_pulleyJoint=a.asm.rt).apply(null,arguments)},Ov=a._emscripten_enum_b2JointType_e_mouseJoint=
function(){return (Ov=a._emscripten_enum_b2JointType_e_mouseJoint=a.asm.st).apply(null,arguments)},Pv=a._emscripten_enum_b2JointType_e_gearJoint=function(){return (Pv=a._emscripten_enum_b2JointType_e_gearJoint=a.asm.tt).apply(null,arguments)},Qv=a._emscripten_enum_b2JointType_e_wheelJoint=function(){return (Qv=a._emscripten_enum_b2JointType_e_wheelJoint=a.asm.ut).apply(null,arguments)},Rv=a._emscripten_enum_b2JointType_e_weldJoint=function(){return (Rv=a._emscripten_enum_b2JointType_e_weldJoint=a.asm.vt).apply(null,
arguments)},Sv=a._emscripten_enum_b2JointType_e_frictionJoint=function(){return (Sv=a._emscripten_enum_b2JointType_e_frictionJoint=a.asm.wt).apply(null,arguments)},Tv=a._emscripten_enum_b2JointType_e_ropeJoint=function(){return (Tv=a._emscripten_enum_b2JointType_e_ropeJoint=a.asm.xt).apply(null,arguments)},Uv=a._emscripten_enum_b2JointType_e_motorJoint=function(){return (Uv=a._emscripten_enum_b2JointType_e_motorJoint=a.asm.yt).apply(null,arguments)},Vv=a._emscripten_enum_b2LimitState_e_inactiveLimit=
function(){return (Vv=a._emscripten_enum_b2LimitState_e_inactiveLimit=a.asm.zt).apply(null,arguments)},Wv=a._emscripten_enum_b2LimitState_e_atLowerLimit=function(){return (Wv=a._emscripten_enum_b2LimitState_e_atLowerLimit=a.asm.At).apply(null,arguments)},Xv=a._emscripten_enum_b2LimitState_e_atUpperLimit=function(){return (Xv=a._emscripten_enum_b2LimitState_e_atUpperLimit=a.asm.Bt).apply(null,arguments)},Yv=a._emscripten_enum_b2LimitState_e_equalLimits=function(){return (Yv=a._emscripten_enum_b2LimitState_e_equalLimits=
a.asm.Ct).apply(null,arguments)},Zv=a._emscripten_enum_b2ManifoldType_e_circles=function(){return (Zv=a._emscripten_enum_b2ManifoldType_e_circles=a.asm.Dt).apply(null,arguments)},$v=a._emscripten_enum_b2ManifoldType_e_faceA=function(){return ($v=a._emscripten_enum_b2ManifoldType_e_faceA=a.asm.Et).apply(null,arguments)},aw=a._emscripten_enum_b2ManifoldType_e_faceB=function(){return (aw=a._emscripten_enum_b2ManifoldType_e_faceB=a.asm.Ft).apply(null,arguments)},bw=a._emscripten_enum_b2BodyType_b2_staticBody=
function(){return (bw=a._emscripten_enum_b2BodyType_b2_staticBody=a.asm.Gt).apply(null,arguments)},cw=a._emscripten_enum_b2BodyType_b2_kinematicBody=function(){return (cw=a._emscripten_enum_b2BodyType_b2_kinematicBody=a.asm.Ht).apply(null,arguments)},dw=a._emscripten_enum_b2BodyType_b2_dynamicBody=function(){return (dw=a._emscripten_enum_b2BodyType_b2_dynamicBody=a.asm.It).apply(null,arguments)},ew=a._emscripten_enum_b2DrawFlag_e_shapeBit=function(){return (ew=a._emscripten_enum_b2DrawFlag_e_shapeBit=
a.asm.Jt).apply(null,arguments)},fw=a._emscripten_enum_b2DrawFlag_e_jointBit=function(){return (fw=a._emscripten_enum_b2DrawFlag_e_jointBit=a.asm.Kt).apply(null,arguments)},gw=a._emscripten_enum_b2DrawFlag_e_aabbBit=function(){return (gw=a._emscripten_enum_b2DrawFlag_e_aabbBit=a.asm.Lt).apply(null,arguments)},hw=a._emscripten_enum_b2DrawFlag_e_pairBit=function(){return (hw=a._emscripten_enum_b2DrawFlag_e_pairBit=a.asm.Mt).apply(null,arguments)},iw=a._emscripten_enum_b2DrawFlag_e_centerOfMassBit=function(){return (iw=
a._emscripten_enum_b2DrawFlag_e_centerOfMassBit=a.asm.Nt).apply(null,arguments)},jw=a._emscripten_enum_b2ContactFeatureType_e_vertex=function(){return (jw=a._emscripten_enum_b2ContactFeatureType_e_vertex=a.asm.Ot).apply(null,arguments)},kw=a._emscripten_enum_b2ContactFeatureType_e_face=function(){return (kw=a._emscripten_enum_b2ContactFeatureType_e_face=a.asm.Pt).apply(null,arguments)};a._malloc=function(){return (a._malloc=a.asm.Qt).apply(null,arguments)};
a._free=function(){return (a._free=a.asm.Rt).apply(null,arguments)};a.dynCall_vi=function(){return (a.dynCall_vi=a.asm.St).apply(null,arguments)};a.dynCall_v=function(){return (a.dynCall_v=a.asm.Tt).apply(null,arguments)};a.asm=bb;var lw;Oa=function mw(){lw||nw();lw||(Oa=mw);};
function nw(){function b(){if(!lw&&(lw=!0,a.calledRun=!0,!ua)){Ka=!0;Fa(Ha);Fa(Ia);aa(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();Ja.unshift(c);}Fa(Ja);}}if(!(0<Ma)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)La();Fa(Ga);0<Ma||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("");},1);b();},1)):
b());}}a.run=nw;if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();noExitRuntime=!0;nw();function e(){}e.prototype=Object.create(e.prototype);e.prototype.constructor=e;e.prototype.Vt=e;e.Wt={};a.WrapperObject=e;function g(b){return (b||e).Wt}a.getCache=g;function h(b,c){var d=g(c),f=d[b];if(f)return f;f=Object.create((c||e).prototype);f.Ut=b;return d[b]=f}a.wrapPointer=h;a.castObject=function(b,c){return h(b.Ut,c)};a.NULL=h(0);
a.destroy=function(b){if(!b.__destroy__)throw "Error: Cannot destroy object. (Did you create it yourself?)";b.__destroy__();delete g(b.Vt)[b.Ut];};a.compare=function(b,c){return b.Ut===c.Ut};a.getPointer=function(b){return b.Ut};a.getClass=function(b){return b.Vt};var ow=0,pw=0,qw=[],rw=0;function sw(){if(rw){for(var b=0;b<qw.length;b++)a._free(qw[b]);qw.length=0;a._free(ow);ow=0;pw+=rw;rw=0;}ow||(pw+=128,ow=a._malloc(pw),assert(ow));}
function tw(){throw "cannot construct a b2DestructionListenerWrapper, no constructor in IDL";}tw.prototype=Object.create(e.prototype);tw.prototype.constructor=tw;tw.prototype.Vt=tw;tw.Wt={};a.b2DestructionListenerWrapper=tw;tw.prototype.__destroy__=function(){cb(this.Ut);};function uw(){throw "cannot construct a b2Draw, no constructor in IDL";}uw.prototype=Object.create(e.prototype);uw.prototype.constructor=uw;uw.prototype.Vt=uw;uw.Wt={};a.b2Draw=uw;
uw.prototype.SetFlags=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);db(c,b);};uw.prototype.GetFlags=function(){return eb(this.Ut)};uw.prototype.AppendFlags=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fb(c,b);};uw.prototype.ClearFlags=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gb(c,b);};uw.prototype.__destroy__=function(){hb(this.Ut);};function k(){throw "cannot construct a b2Joint, no constructor in IDL";}k.prototype=Object.create(e.prototype);
k.prototype.constructor=k;k.prototype.Vt=k;k.Wt={};a.b2Joint=k;k.prototype.GetType=function(){return ib(this.Ut)};k.prototype.GetBodyA=function(){return h(mb(this.Ut),l)};k.prototype.GetBodyB=function(){return h(nb(this.Ut),l)};k.prototype.GetAnchorA=function(){return h(ob(this.Ut),m)};k.prototype.GetAnchorB=function(){return h(pb(this.Ut),m)};k.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(qb(c,b),m)};
k.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return rb(c,b)};k.prototype.GetNext=function(){return h(sb(this.Ut),k)};k.prototype.GetUserData=function(){return tb(this.Ut)};k.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ub(c,b);};k.prototype.IsActive=function(){return !!vb(this.Ut)};k.prototype.GetCollideConnected=function(){return !!wb(this.Ut)};k.prototype.Dump=function(){xb(this.Ut);};
function vw(){throw "cannot construct a b2RayCastCallback, no constructor in IDL";}vw.prototype=Object.create(e.prototype);vw.prototype.constructor=vw;vw.prototype.Vt=vw;vw.Wt={};a.b2RayCastCallback=vw;vw.prototype.__destroy__=function(){yb(this.Ut);};function ww(){throw "cannot construct a b2ContactListener, no constructor in IDL";}ww.prototype=Object.create(e.prototype);ww.prototype.constructor=ww;ww.prototype.Vt=ww;ww.Wt={};a.b2ContactListener=ww;ww.prototype.__destroy__=function(){zb(this.Ut);};
function xw(){throw "cannot construct a b2QueryCallback, no constructor in IDL";}xw.prototype=Object.create(e.prototype);xw.prototype.constructor=xw;xw.prototype.Vt=xw;xw.Wt={};a.b2QueryCallback=xw;xw.prototype.__destroy__=function(){Ab(this.Ut);};function n(){this.Ut=Bb();g(n)[this.Ut]=this;}n.prototype=Object.create(e.prototype);n.prototype.constructor=n;n.prototype.Vt=n;n.Wt={};a.b2JointDef=n;n.prototype.get_type=n.prototype.Xt=function(){return Cb(this.Ut)};
n.prototype.set_type=n.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Db(c,b);};Object.defineProperty(n.prototype,"type",{get:n.prototype.Xt,set:n.prototype.Zt});n.prototype.get_userData=n.prototype.Yt=function(){return Eb(this.Ut)};n.prototype.set_userData=n.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fb(c,b);};Object.defineProperty(n.prototype,"userData",{get:n.prototype.Yt,set:n.prototype.$t});
n.prototype.get_bodyA=n.prototype.au=function(){return h(Gb(this.Ut),l)};n.prototype.set_bodyA=n.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hb(c,b);};Object.defineProperty(n.prototype,"bodyA",{get:n.prototype.au,set:n.prototype.du});n.prototype.get_bodyB=n.prototype.bu=function(){return h(Ib(this.Ut),l)};n.prototype.set_bodyB=n.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jb(c,b);};
Object.defineProperty(n.prototype,"bodyB",{get:n.prototype.bu,set:n.prototype.eu});n.prototype.get_collideConnected=n.prototype.cu=function(){return !!Kb(this.Ut)};n.prototype.set_collideConnected=n.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lb(c,b);};Object.defineProperty(n.prototype,"collideConnected",{get:n.prototype.cu,set:n.prototype.fu});n.prototype.__destroy__=function(){Mb(this.Ut);};function p(){throw "cannot construct a b2Shape, no constructor in IDL";}
p.prototype=Object.create(e.prototype);p.prototype.constructor=p;p.prototype.Vt=p;p.Wt={};a.b2Shape=p;p.prototype.GetType=function(){return Nb(this.Ut)};p.prototype.GetChildCount=function(){return Ob(this.Ut)};p.prototype.TestPoint=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!Pb(d,b,c)};
p.prototype.RayCast=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return !!Qb(y,b,c,d,f)};p.prototype.ComputeAABB=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Rb(f,b,c,d);};p.prototype.ComputeMass=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Sb(d,b,c);};
p.prototype.get_m_type=p.prototype.lu=function(){return Tb(this.Ut)};p.prototype.set_m_type=p.prototype.nu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ub(c,b);};Object.defineProperty(p.prototype,"m_type",{get:p.prototype.lu,set:p.prototype.nu});p.prototype.get_m_radius=p.prototype.ku=function(){return Vb(this.Ut)};p.prototype.set_m_radius=p.prototype.mu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Wb(c,b);};
Object.defineProperty(p.prototype,"m_radius",{get:p.prototype.ku,set:p.prototype.mu});p.prototype.__destroy__=function(){Xb(this.Ut);};function yw(){throw "cannot construct a b2ContactFilter, no constructor in IDL";}yw.prototype=Object.create(e.prototype);yw.prototype.constructor=yw;yw.prototype.Vt=yw;yw.Wt={};a.b2ContactFilter=yw;yw.prototype.__destroy__=function(){Yb(this.Ut);};function zw(){this.Ut=Zb();g(zw)[this.Ut]=this;}zw.prototype=Object.create(tw.prototype);zw.prototype.constructor=zw;
zw.prototype.Vt=zw;zw.Wt={};a.JSDestructionListener=zw;zw.prototype.SayGoodbyeJoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);$b(c,b);};zw.prototype.SayGoodbyeFixture=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ac(c,b);};zw.prototype.__destroy__=function(){bc(this.Ut);};function Aw(){throw "cannot construct a b2ContactImpulse, no constructor in IDL";}Aw.prototype=Object.create(e.prototype);Aw.prototype.constructor=Aw;Aw.prototype.Vt=Aw;Aw.Wt={};a.b2ContactImpulse=Aw;
Aw.prototype.get_count=Aw.prototype.xv=function(){return cc(this.Ut)};Aw.prototype.set_count=Aw.prototype.kx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dc(c,b);};Object.defineProperty(Aw.prototype,"count",{get:Aw.prototype.xv,set:Aw.prototype.kx});Aw.prototype.__destroy__=function(){ec(this.Ut);};function Bw(){throw "cannot construct a b2DistanceJoint, no constructor in IDL";}Bw.prototype=Object.create(k.prototype);Bw.prototype.constructor=Bw;Bw.prototype.Vt=Bw;Bw.Wt={};
a.b2DistanceJoint=Bw;Bw.prototype.GetLocalAnchorA=function(){return h(fc(this.Ut),m)};Bw.prototype.GetLocalAnchorB=function(){return h(hc(this.Ut),m)};Bw.prototype.SetLength=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ic(c,b);};Bw.prototype.GetLength=function(){return jc(this.Ut)};Bw.prototype.SetFrequency=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kc(c,b);};Bw.prototype.GetFrequency=function(){return lc(this.Ut)};
Bw.prototype.SetDampingRatio=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mc(c,b);};Bw.prototype.GetDampingRatio=function(){return nc(this.Ut)};Bw.prototype.GetType=function(){return oc(this.Ut)};Bw.prototype.GetBodyA=function(){return h(pc(this.Ut),l)};Bw.prototype.GetBodyB=function(){return h(qc(this.Ut),l)};Bw.prototype.GetAnchorA=function(){return h(rc(this.Ut),m)};Bw.prototype.GetAnchorB=function(){return h(sc(this.Ut),m)};
Bw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(tc(c,b),m)};Bw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return uc(c,b)};Bw.prototype.GetNext=function(){return h(vc(this.Ut),k)};Bw.prototype.GetUserData=function(){return wc(this.Ut)};Bw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);xc(c,b);};Bw.prototype.IsActive=function(){return !!yc(this.Ut)};
Bw.prototype.GetCollideConnected=function(){return !!zc(this.Ut)};Bw.prototype.__destroy__=function(){Ac(this.Ut);};function q(b,c,d){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);this.Ut=void 0===b?Bc():void 0===c?_emscripten_bind_b2Mat33_b2Mat33_1(b):void 0===d?_emscripten_bind_b2Mat33_b2Mat33_2(b,c):Cc(b,c,d);g(q)[this.Ut]=this;}q.prototype=Object.create(e.prototype);q.prototype.constructor=q;q.prototype.Vt=q;q.Wt={};a.b2Mat33=q;
q.prototype.SetZero=function(){Dc(this.Ut);};q.prototype.Solve33=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Ec(c,b),r)};q.prototype.Solve22=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Fc(c,b),m)};q.prototype.GetInverse22=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Gc(c,b);};q.prototype.GetSymInverse33=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hc(c,b);};q.prototype.get_ex=q.prototype.Cu=function(){return h(Ic(this.Ut),r)};
q.prototype.set_ex=q.prototype.Ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jc(c,b);};Object.defineProperty(q.prototype,"ex",{get:q.prototype.Cu,set:q.prototype.Ru});q.prototype.get_ey=q.prototype.Du=function(){return h(Kc(this.Ut),r)};q.prototype.set_ey=q.prototype.Su=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lc(c,b);};Object.defineProperty(q.prototype,"ey",{get:q.prototype.Du,set:q.prototype.Su});q.prototype.get_ez=q.prototype.zv=function(){return h(Mc(this.Ut),r)};
q.prototype.set_ez=q.prototype.mx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nc(c,b);};Object.defineProperty(q.prototype,"ez",{get:q.prototype.zv,set:q.prototype.mx});q.prototype.__destroy__=function(){Oc(this.Ut);};function t(){throw "cannot construct a b2Fixture, no constructor in IDL";}t.prototype=Object.create(e.prototype);t.prototype.constructor=t;t.prototype.Vt=t;t.Wt={};a.b2Fixture=t;t.prototype.GetType=function(){return Pc(this.Ut)};
t.prototype.GetShape=function(){return h(Qc(this.Ut),p)};t.prototype.SetSensor=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Rc(c,b);};t.prototype.IsSensor=function(){return !!Sc(this.Ut)};t.prototype.SetFilterData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Tc(c,b);};t.prototype.GetFilterData=function(){return h(Uc(this.Ut),u)};t.prototype.Refilter=function(){Vc(this.Ut);};t.prototype.GetBody=function(){return h(Wc(this.Ut),l)};
t.prototype.GetNext=function(){return h(Xc(this.Ut),t)};t.prototype.GetUserData=function(){return Yc(this.Ut)};t.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zc(c,b);};t.prototype.TestPoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return !!$c(c,b)};t.prototype.RayCast=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);return !!ad(f,b,c,d)};
t.prototype.GetMassData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bd(c,b);};t.prototype.SetDensity=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cd(c,b);};t.prototype.GetDensity=function(){return dd(this.Ut)};t.prototype.GetFriction=function(){return ed(this.Ut)};t.prototype.SetFriction=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fd(c,b);};t.prototype.GetRestitution=function(){return gd(this.Ut)};
t.prototype.SetRestitution=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hd(c,b);};t.prototype.GetAABB=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(id(c,b),v)};t.prototype.Dump=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);jd(c,b);};t.prototype.__destroy__=function(){kd(this.Ut);};function u(){this.Ut=ld();g(u)[this.Ut]=this;}u.prototype=Object.create(e.prototype);u.prototype.constructor=u;u.prototype.Vt=u;u.Wt={};a.b2Filter=u;
u.prototype.get_categoryBits=u.prototype.rv=function(){return md(this.Ut)};u.prototype.set_categoryBits=u.prototype.ex=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);nd(c,b);};Object.defineProperty(u.prototype,"categoryBits",{get:u.prototype.rv,set:u.prototype.ex});u.prototype.get_maskBits=u.prototype.nw=function(){return od(this.Ut)};u.prototype.set_maskBits=u.prototype.ay=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);pd(c,b);};
Object.defineProperty(u.prototype,"maskBits",{get:u.prototype.nw,set:u.prototype.ay});u.prototype.get_groupIndex=u.prototype.Iv=function(){return qd(this.Ut)};u.prototype.set_groupIndex=u.prototype.vx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rd(c,b);};Object.defineProperty(u.prototype,"groupIndex",{get:u.prototype.Iv,set:u.prototype.vx});u.prototype.__destroy__=function(){sd(this.Ut);};function Cw(){this.Ut=td();g(Cw)[this.Ut]=this;}Cw.prototype=Object.create(xw.prototype);
Cw.prototype.constructor=Cw;Cw.prototype.Vt=Cw;Cw.Wt={};a.JSQueryCallback=Cw;Cw.prototype.ReportFixture=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return !!ud(c,b)};Cw.prototype.__destroy__=function(){vd(this.Ut);};function Dw(){throw "cannot construct a b2MouseJoint, no constructor in IDL";}Dw.prototype=Object.create(k.prototype);Dw.prototype.constructor=Dw;Dw.prototype.Vt=Dw;Dw.Wt={};a.b2MouseJoint=Dw;
Dw.prototype.SetTarget=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wd(c,b);};Dw.prototype.GetTarget=function(){return h(xd(this.Ut),m)};Dw.prototype.SetMaxForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);yd(c,b);};Dw.prototype.GetMaxForce=function(){return zd(this.Ut)};Dw.prototype.SetFrequency=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ad(c,b);};Dw.prototype.GetFrequency=function(){return Bd(this.Ut)};
Dw.prototype.SetDampingRatio=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Cd(c,b);};Dw.prototype.GetDampingRatio=function(){return Dd(this.Ut)};Dw.prototype.GetType=function(){return Ed(this.Ut)};Dw.prototype.GetBodyA=function(){return h(Fd(this.Ut),l)};Dw.prototype.GetBodyB=function(){return h(Gd(this.Ut),l)};Dw.prototype.GetAnchorA=function(){return h(Hd(this.Ut),m)};Dw.prototype.GetAnchorB=function(){return h(Id(this.Ut),m)};
Dw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Jd(c,b),m)};Dw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return Kd(c,b)};Dw.prototype.GetNext=function(){return h(Ld(this.Ut),k)};Dw.prototype.GetUserData=function(){return Md(this.Ut)};Dw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nd(c,b);};Dw.prototype.IsActive=function(){return !!Od(this.Ut)};
Dw.prototype.GetCollideConnected=function(){return !!Pd(this.Ut)};Dw.prototype.__destroy__=function(){Qd(this.Ut);};function Ew(b){b&&"object"===typeof b&&(b=b.Ut);this.Ut=void 0===b?Rd():Sd(b);g(Ew)[this.Ut]=this;}Ew.prototype=Object.create(e.prototype);Ew.prototype.constructor=Ew;Ew.prototype.Vt=Ew;Ew.Wt={};a.b2Rot=Ew;Ew.prototype.Set=Ew.prototype.Set=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Td(c,b);};Ew.prototype.SetIdentity=function(){Ud(this.Ut);};Ew.prototype.GetAngle=function(){return Vd(this.Ut)};
Ew.prototype.GetXAxis=function(){return h(Wd(this.Ut),m)};Ew.prototype.GetYAxis=function(){return h(Xd(this.Ut),m)};Ew.prototype.get_s=Ew.prototype.Cw=function(){return Yd(this.Ut)};Ew.prototype.set_s=Ew.prototype.py=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zd(c,b);};Object.defineProperty(Ew.prototype,"s",{get:Ew.prototype.Cw,set:Ew.prototype.py});Ew.prototype.get_c=Ew.prototype.qv=function(){return $d(this.Ut)};
Ew.prototype.set_c=Ew.prototype.dx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ae(c,b);};Object.defineProperty(Ew.prototype,"c",{get:Ew.prototype.qv,set:Ew.prototype.dx});Ew.prototype.__destroy__=function(){be(this.Ut);};function Fw(){throw "cannot construct a b2MotorJoint, no constructor in IDL";}Fw.prototype=Object.create(k.prototype);Fw.prototype.constructor=Fw;Fw.prototype.Vt=Fw;Fw.Wt={};a.b2MotorJoint=Fw;
Fw.prototype.SetLinearOffset=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ce(c,b);};Fw.prototype.GetLinearOffset=function(){return h(de(this.Ut),m)};Fw.prototype.SetAngularOffset=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ee(c,b);};Fw.prototype.GetAngularOffset=function(){return fe(this.Ut)};Fw.prototype.SetMaxForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ge(c,b);};Fw.prototype.GetMaxForce=function(){return he(this.Ut)};
Fw.prototype.SetMaxTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ie(c,b);};Fw.prototype.GetMaxTorque=function(){return je(this.Ut)};Fw.prototype.SetCorrectionFactor=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ke(c,b);};Fw.prototype.GetCorrectionFactor=function(){return le(this.Ut)};Fw.prototype.GetType=function(){return me(this.Ut)};Fw.prototype.GetBodyA=function(){return h(ne(this.Ut),l)};Fw.prototype.GetBodyB=function(){return h(oe(this.Ut),l)};
Fw.prototype.GetAnchorA=function(){return h(pe(this.Ut),m)};Fw.prototype.GetAnchorB=function(){return h(qe(this.Ut),m)};Fw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(re(c,b),m)};Fw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return se(c,b)};Fw.prototype.GetNext=function(){return h(te(this.Ut),k)};Fw.prototype.GetUserData=function(){return ue(this.Ut)};
Fw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ve(c,b);};Fw.prototype.IsActive=function(){return !!we(this.Ut)};Fw.prototype.GetCollideConnected=function(){return !!xe(this.Ut)};Fw.prototype.__destroy__=function(){ye(this.Ut);};function w(){throw "cannot construct a b2Profile, no constructor in IDL";}w.prototype=Object.create(e.prototype);w.prototype.constructor=w;w.prototype.Vt=w;w.Wt={};a.b2Profile=w;w.prototype.get_step=w.prototype.Kw=function(){return ze(this.Ut)};
w.prototype.set_step=w.prototype.xy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ae(c,b);};Object.defineProperty(w.prototype,"step",{get:w.prototype.Kw,set:w.prototype.xy});w.prototype.get_collide=w.prototype.uv=function(){return Be(this.Ut)};w.prototype.set_collide=w.prototype.hx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ce(c,b);};Object.defineProperty(w.prototype,"collide",{get:w.prototype.uv,set:w.prototype.hx});w.prototype.get_solve=w.prototype.Fw=function(){return De(this.Ut)};
w.prototype.set_solve=w.prototype.sy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ee(c,b);};Object.defineProperty(w.prototype,"solve",{get:w.prototype.Fw,set:w.prototype.sy});w.prototype.get_solveInit=w.prototype.Gw=function(){return Fe(this.Ut)};w.prototype.set_solveInit=w.prototype.ty=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ge(c,b);};Object.defineProperty(w.prototype,"solveInit",{get:w.prototype.Gw,set:w.prototype.ty});
w.prototype.get_solveVelocity=w.prototype.Jw=function(){return He(this.Ut)};w.prototype.set_solveVelocity=w.prototype.wy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ie(c,b);};Object.defineProperty(w.prototype,"solveVelocity",{get:w.prototype.Jw,set:w.prototype.wy});w.prototype.get_solvePosition=w.prototype.Hw=function(){return Je(this.Ut)};w.prototype.set_solvePosition=w.prototype.uy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ke(c,b);};
Object.defineProperty(w.prototype,"solvePosition",{get:w.prototype.Hw,set:w.prototype.uy});w.prototype.get_broadphase=w.prototype.ov=function(){return Le(this.Ut)};w.prototype.set_broadphase=w.prototype.bx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Me(c,b);};Object.defineProperty(w.prototype,"broadphase",{get:w.prototype.ov,set:w.prototype.bx});w.prototype.get_solveTOI=w.prototype.Iw=function(){return Ne(this.Ut)};
w.prototype.set_solveTOI=w.prototype.vy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Oe(c,b);};Object.defineProperty(w.prototype,"solveTOI",{get:w.prototype.Iw,set:w.prototype.vy});w.prototype.__destroy__=function(){Pe(this.Ut);};function Gw(){throw "cannot construct a VoidPtr, no constructor in IDL";}Gw.prototype=Object.create(e.prototype);Gw.prototype.constructor=Gw;Gw.prototype.Vt=Gw;Gw.Wt={};a.VoidPtr=Gw;Gw.prototype.__destroy__=function(){Qe(this.Ut);};
function x(){this.Ut=Re();g(x)[this.Ut]=this;}x.prototype=Object.create(e.prototype);x.prototype.constructor=x;x.prototype.Vt=x;x.Wt={};a.b2BodyDef=x;x.prototype.get_type=x.prototype.Xt=function(){return Se(this.Ut)};x.prototype.set_type=x.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Te(c,b);};Object.defineProperty(x.prototype,"type",{get:x.prototype.Xt,set:x.prototype.Zt});x.prototype.get_position=x.prototype.yw=function(){return h(Ue(this.Ut),m)};
x.prototype.set_position=x.prototype.ly=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ve(c,b);};Object.defineProperty(x.prototype,"position",{get:x.prototype.yw,set:x.prototype.ly});x.prototype.get_angle=x.prototype.iv=function(){return We(this.Ut)};x.prototype.set_angle=x.prototype.Ww=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xe(c,b);};Object.defineProperty(x.prototype,"angle",{get:x.prototype.iv,set:x.prototype.Ww});
x.prototype.get_linearVelocity=x.prototype.Wv=function(){return h(Ye(this.Ut),m)};x.prototype.set_linearVelocity=x.prototype.Jx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ze(c,b);};Object.defineProperty(x.prototype,"linearVelocity",{get:x.prototype.Wv,set:x.prototype.Jx});x.prototype.get_angularVelocity=x.prototype.lv=function(){return $e(this.Ut)};x.prototype.set_angularVelocity=x.prototype.Zw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);af(c,b);};
Object.defineProperty(x.prototype,"angularVelocity",{get:x.prototype.lv,set:x.prototype.Zw});x.prototype.get_linearDamping=x.prototype.Uv=function(){return bf(this.Ut)};x.prototype.set_linearDamping=x.prototype.Hx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cf(c,b);};Object.defineProperty(x.prototype,"linearDamping",{get:x.prototype.Uv,set:x.prototype.Hx});x.prototype.get_angularDamping=x.prototype.jv=function(){return df(this.Ut)};
x.prototype.set_angularDamping=x.prototype.Xw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ef(c,b);};Object.defineProperty(x.prototype,"angularDamping",{get:x.prototype.jv,set:x.prototype.Xw});x.prototype.get_allowSleep=x.prototype.hv=function(){return !!ff(this.Ut)};x.prototype.set_allowSleep=x.prototype.Vw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gf(c,b);};Object.defineProperty(x.prototype,"allowSleep",{get:x.prototype.hv,set:x.prototype.Vw});
x.prototype.get_awake=x.prototype.mv=function(){return !!hf(this.Ut)};x.prototype.set_awake=x.prototype.$w=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);jf(c,b);};Object.defineProperty(x.prototype,"awake",{get:x.prototype.mv,set:x.prototype.$w});x.prototype.get_fixedRotation=x.prototype.Bv=function(){return !!kf(this.Ut)};x.prototype.set_fixedRotation=x.prototype.ox=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);lf(c,b);};
Object.defineProperty(x.prototype,"fixedRotation",{get:x.prototype.Bv,set:x.prototype.ox});x.prototype.get_bullet=x.prototype.pv=function(){return !!mf(this.Ut)};x.prototype.set_bullet=x.prototype.cx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);nf(c,b);};Object.defineProperty(x.prototype,"bullet",{get:x.prototype.pv,set:x.prototype.cx});x.prototype.get_active=x.prototype.gv=function(){return !!of(this.Ut)};
x.prototype.set_active=x.prototype.Uw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);pf(c,b);};Object.defineProperty(x.prototype,"active",{get:x.prototype.gv,set:x.prototype.Uw});x.prototype.get_userData=x.prototype.Yt=function(){return qf(this.Ut)};x.prototype.set_userData=x.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rf(c,b);};Object.defineProperty(x.prototype,"userData",{get:x.prototype.Yt,set:x.prototype.$t});x.prototype.get_gravityScale=x.prototype.Fv=function(){return sf(this.Ut)};
x.prototype.set_gravityScale=x.prototype.sx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);tf(c,b);};Object.defineProperty(x.prototype,"gravityScale",{get:x.prototype.Fv,set:x.prototype.sx});x.prototype.__destroy__=function(){uf(this.Ut);};function Hw(){this.Ut=vf();g(Hw)[this.Ut]=this;}Hw.prototype=Object.create(vw.prototype);Hw.prototype.constructor=Hw;Hw.prototype.Vt=Hw;Hw.Wt={};a.JSRayCastCallback=Hw;
Hw.prototype.ReportFixture=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return wf(y,b,c,d,f)};Hw.prototype.__destroy__=function(){xf(this.Ut);};function z(){throw "cannot construct a b2ContactFeature, no constructor in IDL";}z.prototype=Object.create(e.prototype);z.prototype.constructor=z;z.prototype.Vt=z;z.Wt={};a.b2ContactFeature=z;z.prototype.get_indexA=z.prototype.Kv=function(){return yf(this.Ut)};
z.prototype.set_indexA=z.prototype.xx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);zf(c,b);};Object.defineProperty(z.prototype,"indexA",{get:z.prototype.Kv,set:z.prototype.xx});z.prototype.get_indexB=z.prototype.Lv=function(){return Af(this.Ut)};z.prototype.set_indexB=z.prototype.yx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bf(c,b);};Object.defineProperty(z.prototype,"indexB",{get:z.prototype.Lv,set:z.prototype.yx});z.prototype.get_typeA=z.prototype.Nw=function(){return Cf(this.Ut)};
z.prototype.set_typeA=z.prototype.Ay=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Df(c,b);};Object.defineProperty(z.prototype,"typeA",{get:z.prototype.Nw,set:z.prototype.Ay});z.prototype.get_typeB=z.prototype.Ow=function(){return Ef(this.Ut)};z.prototype.set_typeB=z.prototype.By=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ff(c,b);};Object.defineProperty(z.prototype,"typeB",{get:z.prototype.Ow,set:z.prototype.By});z.prototype.__destroy__=function(){Gf(this.Ut);};
function m(b,c){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);this.Ut=void 0===b?Hf():void 0===c?_emscripten_bind_b2Vec2_b2Vec2_1(b):If(b,c);g(m)[this.Ut]=this;}m.prototype=Object.create(e.prototype);m.prototype.constructor=m;m.prototype.Vt=m;m.Wt={};a.b2Vec2=m;m.prototype.SetZero=function(){Jf(this.Ut);};m.prototype.Set=m.prototype.Set=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Kf(d,b,c);};
m.prototype.op_add=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lf(c,b);};m.prototype.op_sub=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Mf(c,b);};m.prototype.op_mul=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nf(c,b);};m.prototype.Length=function(){return Of(this.Ut)};m.prototype.LengthSquared=function(){return Pf(this.Ut)};m.prototype.Normalize=function(){return Qf(this.Ut)};m.prototype.IsValid=function(){return !!Rf(this.Ut)};
m.prototype.Skew=function(){return h(Sf(this.Ut),m)};m.prototype.get_x=m.prototype.Ou=function(){return Tf(this.Ut)};m.prototype.set_x=m.prototype.cv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Uf(c,b);};Object.defineProperty(m.prototype,"x",{get:m.prototype.Ou,set:m.prototype.cv});m.prototype.get_y=m.prototype.Pu=function(){return Vf(this.Ut)};m.prototype.set_y=m.prototype.dv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Wf(c,b);};
Object.defineProperty(m.prototype,"y",{get:m.prototype.Pu,set:m.prototype.dv});m.prototype.__destroy__=function(){Xf(this.Ut);};function r(b,c,d){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);this.Ut=void 0===b?Yf():void 0===c?_emscripten_bind_b2Vec3_b2Vec3_1(b):void 0===d?_emscripten_bind_b2Vec3_b2Vec3_2(b,c):Zf(b,c,d);g(r)[this.Ut]=this;}r.prototype=Object.create(e.prototype);r.prototype.constructor=r;r.prototype.Vt=r;r.Wt={};a.b2Vec3=r;
r.prototype.SetZero=function(){$f(this.Ut);};r.prototype.Set=r.prototype.Set=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);ag(f,b,c,d);};r.prototype.op_add=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bg(c,b);};r.prototype.op_sub=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cg(c,b);};r.prototype.op_mul=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dg(c,b);};
r.prototype.get_x=r.prototype.Ou=function(){return eg(this.Ut)};r.prototype.set_x=r.prototype.cv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fg(c,b);};Object.defineProperty(r.prototype,"x",{get:r.prototype.Ou,set:r.prototype.cv});r.prototype.get_y=r.prototype.Pu=function(){return gg(this.Ut)};r.prototype.set_y=r.prototype.dv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hg(c,b);};Object.defineProperty(r.prototype,"y",{get:r.prototype.Pu,set:r.prototype.dv});
r.prototype.get_z=r.prototype.Sw=function(){return ig(this.Ut)};r.prototype.set_z=r.prototype.Fy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);jg(c,b);};Object.defineProperty(r.prototype,"z",{get:r.prototype.Sw,set:r.prototype.Fy});r.prototype.__destroy__=function(){kg(this.Ut);};function v(){this.Ut=lg();g(v)[this.Ut]=this;}v.prototype=Object.create(e.prototype);v.prototype.constructor=v;v.prototype.Vt=v;v.Wt={};a.b2AABB=v;v.prototype.IsValid=function(){return !!mg(this.Ut)};
v.prototype.GetCenter=function(){return h(ng(this.Ut),m)};v.prototype.GetExtents=function(){return h(og(this.Ut),m)};v.prototype.GetPerimeter=function(){return pg(this.Ut)};v.prototype.Combine=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);void 0===c?qg(d,b):rg(d,b,c);};v.prototype.Contains=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return !!sg(c,b)};
v.prototype.RayCast=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!tg(d,b,c)};v.prototype.get_lowerBound=v.prototype.Zv=function(){return h(ug(this.Ut),m)};v.prototype.set_lowerBound=v.prototype.Mx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);vg(c,b);};Object.defineProperty(v.prototype,"lowerBound",{get:v.prototype.Zv,set:v.prototype.Mx});v.prototype.get_upperBound=v.prototype.Qw=function(){return h(wg(this.Ut),m)};
v.prototype.set_upperBound=v.prototype.Dy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);xg(c,b);};Object.defineProperty(v.prototype,"upperBound",{get:v.prototype.Qw,set:v.prototype.Dy});v.prototype.__destroy__=function(){yg(this.Ut);};function A(){this.Ut=zg();g(A)[this.Ut]=this;}A.prototype=Object.create(e.prototype);A.prototype.constructor=A;A.prototype.Vt=A;A.Wt={};a.b2FixtureDef=A;A.prototype.get_shape=A.prototype.Ew=function(){return h(Ag(this.Ut),p)};
A.prototype.set_shape=A.prototype.ry=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bg(c,b);};Object.defineProperty(A.prototype,"shape",{get:A.prototype.Ew,set:A.prototype.ry});A.prototype.get_userData=A.prototype.Yt=function(){return Cg(this.Ut)};A.prototype.set_userData=A.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Dg(c,b);};Object.defineProperty(A.prototype,"userData",{get:A.prototype.Yt,set:A.prototype.$t});A.prototype.get_friction=A.prototype.Dv=function(){return Eg(this.Ut)};
A.prototype.set_friction=A.prototype.qx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fg(c,b);};Object.defineProperty(A.prototype,"friction",{get:A.prototype.Dv,set:A.prototype.qx});A.prototype.get_restitution=A.prototype.Bw=function(){return Gg(this.Ut)};A.prototype.set_restitution=A.prototype.oy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hg(c,b);};Object.defineProperty(A.prototype,"restitution",{get:A.prototype.Bw,set:A.prototype.oy});
A.prototype.get_density=A.prototype.yv=function(){return Ig(this.Ut)};A.prototype.set_density=A.prototype.lx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jg(c,b);};Object.defineProperty(A.prototype,"density",{get:A.prototype.yv,set:A.prototype.lx});A.prototype.get_isSensor=A.prototype.Mv=function(){return !!Kg(this.Ut)};A.prototype.set_isSensor=A.prototype.zx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lg(c,b);};
Object.defineProperty(A.prototype,"isSensor",{get:A.prototype.Mv,set:A.prototype.zx});A.prototype.get_filter=A.prototype.Av=function(){return h(Mg(this.Ut),u)};A.prototype.set_filter=A.prototype.nx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ng(c,b);};Object.defineProperty(A.prototype,"filter",{get:A.prototype.Av,set:A.prototype.nx});A.prototype.__destroy__=function(){Og(this.Ut);};function B(){this.Ut=Pg();g(B)[this.Ut]=this;}B.prototype=Object.create(n.prototype);
B.prototype.constructor=B;B.prototype.Vt=B;B.Wt={};a.b2FrictionJointDef=B;B.prototype.Initialize=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Qg(f,b,c,d);};B.prototype.get_localAnchorA=B.prototype.gu=function(){return h(Rg(this.Ut),m)};B.prototype.set_localAnchorA=B.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Sg(c,b);};Object.defineProperty(B.prototype,"localAnchorA",{get:B.prototype.gu,set:B.prototype.iu});
B.prototype.get_localAnchorB=B.prototype.hu=function(){return h(Tg(this.Ut),m)};B.prototype.set_localAnchorB=B.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ug(c,b);};Object.defineProperty(B.prototype,"localAnchorB",{get:B.prototype.hu,set:B.prototype.ju});B.prototype.get_maxForce=B.prototype.tu=function(){return Vg(this.Ut)};B.prototype.set_maxForce=B.prototype.xu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Wg(c,b);};
Object.defineProperty(B.prototype,"maxForce",{get:B.prototype.tu,set:B.prototype.xu});B.prototype.get_maxTorque=B.prototype.Iu=function(){return Xg(this.Ut)};B.prototype.set_maxTorque=B.prototype.Xu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Yg(c,b);};Object.defineProperty(B.prototype,"maxTorque",{get:B.prototype.Iu,set:B.prototype.Xu});B.prototype.get_type=B.prototype.Xt=function(){return Zg(this.Ut)};
B.prototype.set_type=B.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);$g(c,b);};Object.defineProperty(B.prototype,"type",{get:B.prototype.Xt,set:B.prototype.Zt});B.prototype.get_userData=B.prototype.Yt=function(){return ah(this.Ut)};B.prototype.set_userData=B.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bh(c,b);};Object.defineProperty(B.prototype,"userData",{get:B.prototype.Yt,set:B.prototype.$t});
B.prototype.get_bodyA=B.prototype.au=function(){return h(ch(this.Ut),l)};B.prototype.set_bodyA=B.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dh(c,b);};Object.defineProperty(B.prototype,"bodyA",{get:B.prototype.au,set:B.prototype.du});B.prototype.get_bodyB=B.prototype.bu=function(){return h(eh(this.Ut),l)};B.prototype.set_bodyB=B.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fh(c,b);};
Object.defineProperty(B.prototype,"bodyB",{get:B.prototype.bu,set:B.prototype.eu});B.prototype.get_collideConnected=B.prototype.cu=function(){return !!gh(this.Ut)};B.prototype.set_collideConnected=B.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hh(c,b);};Object.defineProperty(B.prototype,"collideConnected",{get:B.prototype.cu,set:B.prototype.fu});B.prototype.__destroy__=function(){ih(this.Ut);};function C(){this.Ut=jh();g(C)[this.Ut]=this;}C.prototype=Object.create(e.prototype);
C.prototype.constructor=C;C.prototype.Vt=C;C.Wt={};a.b2Manifold=C;C.prototype.get_localNormal=C.prototype.Xv=function(){return h(kh(this.Ut),m)};C.prototype.set_localNormal=C.prototype.Kx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);lh(c,b);};Object.defineProperty(C.prototype,"localNormal",{get:C.prototype.Xv,set:C.prototype.Kx});C.prototype.get_localPoint=C.prototype.Fu=function(){return h(mh(this.Ut),m)};
C.prototype.set_localPoint=C.prototype.Uu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);nh(c,b);};Object.defineProperty(C.prototype,"localPoint",{get:C.prototype.Fu,set:C.prototype.Uu});C.prototype.get_type=C.prototype.Xt=function(){return oh(this.Ut)};C.prototype.set_type=C.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ph(c,b);};Object.defineProperty(C.prototype,"type",{get:C.prototype.Xt,set:C.prototype.Zt});C.prototype.get_pointCount=C.prototype.ww=function(){return qh(this.Ut)};
C.prototype.set_pointCount=C.prototype.jy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rh(c,b);};Object.defineProperty(C.prototype,"pointCount",{get:C.prototype.ww,set:C.prototype.jy});C.prototype.__destroy__=function(){sh(this.Ut);};function D(){this.Ut=th();g(D)[this.Ut]=this;}D.prototype=Object.create(e.prototype);D.prototype.constructor=D;D.prototype.Vt=D;D.Wt={};a.b2WorldManifold=D;
D.prototype.Initialize=function(b,c,d,f,y){var oa=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);y&&"object"===typeof y&&(y=y.Ut);uh(oa,b,c,d,f,y);};D.prototype.get_normal=D.prototype.Ku=function(){return h(vh(this.Ut),m)};D.prototype.set_normal=D.prototype.Zu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wh(c,b);};Object.defineProperty(D.prototype,"normal",{get:D.prototype.Ku,set:D.prototype.Zu});
D.prototype.get_points=D.prototype.xw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(xh(c,b),m)};D.prototype.set_points=D.prototype.ky=function(b,c){var d=this.Ut;sw();b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);yh(d,b,c);};Object.defineProperty(D.prototype,"points",{get:D.prototype.xw,set:D.prototype.ky});D.prototype.get_separations=D.prototype.Dw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return zh(c,b)};
D.prototype.set_separations=D.prototype.qy=function(b,c){var d=this.Ut;sw();b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Ah(d,b,c);};Object.defineProperty(D.prototype,"separations",{get:D.prototype.Dw,set:D.prototype.qy});D.prototype.__destroy__=function(){Bh(this.Ut);};function E(){this.Ut=Ch();g(E)[this.Ut]=this;}E.prototype=Object.create(n.prototype);E.prototype.constructor=E;E.prototype.Vt=E;E.Wt={};a.b2PrismaticJointDef=E;
E.prototype.Initialize=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);Dh(y,b,c,d,f);};E.prototype.get_localAnchorA=E.prototype.gu=function(){return h(Eh(this.Ut),m)};E.prototype.set_localAnchorA=E.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fh(c,b);};Object.defineProperty(E.prototype,"localAnchorA",{get:E.prototype.gu,set:E.prototype.iu});
E.prototype.get_localAnchorB=E.prototype.hu=function(){return h(Gh(this.Ut),m)};E.prototype.set_localAnchorB=E.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hh(c,b);};Object.defineProperty(E.prototype,"localAnchorB",{get:E.prototype.hu,set:E.prototype.ju});E.prototype.get_localAxisA=E.prototype.Eu=function(){return h(Ih(this.Ut),m)};E.prototype.set_localAxisA=E.prototype.Tu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jh(c,b);};
Object.defineProperty(E.prototype,"localAxisA",{get:E.prototype.Eu,set:E.prototype.Tu});E.prototype.get_referenceAngle=E.prototype.vu=function(){return Kh(this.Ut)};E.prototype.set_referenceAngle=E.prototype.zu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lh(c,b);};Object.defineProperty(E.prototype,"referenceAngle",{get:E.prototype.vu,set:E.prototype.zu});E.prototype.get_enableLimit=E.prototype.Bu=function(){return !!Mh(this.Ut)};
E.prototype.set_enableLimit=E.prototype.Qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nh(c,b);};Object.defineProperty(E.prototype,"enableLimit",{get:E.prototype.Bu,set:E.prototype.Qu});E.prototype.get_lowerTranslation=E.prototype.$v=function(){return Oh(this.Ut)};E.prototype.set_lowerTranslation=E.prototype.Nx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ph(c,b);};Object.defineProperty(E.prototype,"lowerTranslation",{get:E.prototype.$v,set:E.prototype.Nx});
E.prototype.get_upperTranslation=E.prototype.Rw=function(){return Qh(this.Ut)};E.prototype.set_upperTranslation=E.prototype.Ey=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Rh(c,b);};Object.defineProperty(E.prototype,"upperTranslation",{get:E.prototype.Rw,set:E.prototype.Ey});E.prototype.get_enableMotor=E.prototype.su=function(){return !!Sh(this.Ut)};E.prototype.set_enableMotor=E.prototype.wu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Th(c,b);};
Object.defineProperty(E.prototype,"enableMotor",{get:E.prototype.su,set:E.prototype.wu});E.prototype.get_maxMotorForce=E.prototype.rw=function(){return Uh(this.Ut)};E.prototype.set_maxMotorForce=E.prototype.ey=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vh(c,b);};Object.defineProperty(E.prototype,"maxMotorForce",{get:E.prototype.rw,set:E.prototype.ey});E.prototype.get_motorSpeed=E.prototype.uu=function(){return Wh(this.Ut)};
E.prototype.set_motorSpeed=E.prototype.yu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xh(c,b);};Object.defineProperty(E.prototype,"motorSpeed",{get:E.prototype.uu,set:E.prototype.yu});E.prototype.get_type=E.prototype.Xt=function(){return Yh(this.Ut)};E.prototype.set_type=E.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zh(c,b);};Object.defineProperty(E.prototype,"type",{get:E.prototype.Xt,set:E.prototype.Zt});E.prototype.get_userData=E.prototype.Yt=function(){return $h(this.Ut)};
E.prototype.set_userData=E.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ai(c,b);};Object.defineProperty(E.prototype,"userData",{get:E.prototype.Yt,set:E.prototype.$t});E.prototype.get_bodyA=E.prototype.au=function(){return h(bi(this.Ut),l)};E.prototype.set_bodyA=E.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ci(c,b);};Object.defineProperty(E.prototype,"bodyA",{get:E.prototype.au,set:E.prototype.du});
E.prototype.get_bodyB=E.prototype.bu=function(){return h(di(this.Ut),l)};E.prototype.set_bodyB=E.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ei(c,b);};Object.defineProperty(E.prototype,"bodyB",{get:E.prototype.bu,set:E.prototype.eu});E.prototype.get_collideConnected=E.prototype.cu=function(){return !!fi(this.Ut)};E.prototype.set_collideConnected=E.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gi(c,b);};
Object.defineProperty(E.prototype,"collideConnected",{get:E.prototype.cu,set:E.prototype.fu});E.prototype.__destroy__=function(){hi(this.Ut);};function F(b){b&&"object"===typeof b&&(b=b.Ut);this.Ut=ii(b);g(F)[this.Ut]=this;}F.prototype=Object.create(e.prototype);F.prototype.constructor=F;F.prototype.Vt=F;F.Wt={};a.b2World=F;F.prototype.SetDestructionListener=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ji(c,b);};
F.prototype.SetContactFilter=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ki(c,b);};F.prototype.SetContactListener=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);li(c,b);};F.prototype.SetDebugDraw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mi(c,b);};F.prototype.CreateBody=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(ni(c,b),l)};F.prototype.DestroyBody=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);oi(c,b);};
F.prototype.CreateJoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(pi(c,b),k)};F.prototype.DestroyJoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qi(c,b);};F.prototype.Step=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);ri(f,b,c,d);};F.prototype.ClearForces=function(){si(this.Ut);};F.prototype.DrawDebugData=function(){ti(this.Ut);};
F.prototype.QueryAABB=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);ui(d,b,c);};F.prototype.RayCast=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);vi(f,b,c,d);};F.prototype.GetBodyList=function(){return h(wi(this.Ut),l)};F.prototype.GetJointList=function(){return h(xi(this.Ut),k)};F.prototype.GetContactList=function(){return h(yi(this.Ut),Iw)};
F.prototype.SetAllowSleeping=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);zi(c,b);};F.prototype.GetAllowSleeping=function(){return !!Ai(this.Ut)};F.prototype.SetWarmStarting=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bi(c,b);};F.prototype.GetWarmStarting=function(){return !!Ci(this.Ut)};F.prototype.SetContinuousPhysics=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Di(c,b);};F.prototype.GetContinuousPhysics=function(){return !!Ei(this.Ut)};
F.prototype.SetSubStepping=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fi(c,b);};F.prototype.GetSubStepping=function(){return !!Gi(this.Ut)};F.prototype.GetProxyCount=function(){return Hi(this.Ut)};F.prototype.GetBodyCount=function(){return Ii(this.Ut)};F.prototype.GetJointCount=function(){return Ji(this.Ut)};F.prototype.GetContactCount=function(){return Ki(this.Ut)};F.prototype.GetTreeHeight=function(){return Li(this.Ut)};F.prototype.GetTreeBalance=function(){return Mi(this.Ut)};
F.prototype.GetTreeQuality=function(){return Ni(this.Ut)};F.prototype.SetGravity=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Oi(c,b);};F.prototype.GetGravity=function(){return h(Pi(this.Ut),m)};F.prototype.IsLocked=function(){return !!Qi(this.Ut)};F.prototype.SetAutoClearForces=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ri(c,b);};F.prototype.GetAutoClearForces=function(){return !!Si(this.Ut)};F.prototype.GetProfile=function(){return h(Ti(this.Ut),w)};F.prototype.Dump=function(){Ui(this.Ut);};
F.prototype.__destroy__=function(){Vi(this.Ut);};function G(){throw "cannot construct a b2PrismaticJoint, no constructor in IDL";}G.prototype=Object.create(k.prototype);G.prototype.constructor=G;G.prototype.Vt=G;G.Wt={};a.b2PrismaticJoint=G;G.prototype.GetLocalAnchorA=function(){return h(Wi(this.Ut),m)};G.prototype.GetLocalAnchorB=function(){return h(Xi(this.Ut),m)};G.prototype.GetLocalAxisA=function(){return h(Yi(this.Ut),m)};G.prototype.GetReferenceAngle=function(){return Zi(this.Ut)};
G.prototype.GetJointTranslation=function(){return $i(this.Ut)};G.prototype.GetJointSpeed=function(){return aj(this.Ut)};G.prototype.IsLimitEnabled=function(){return !!bj(this.Ut)};G.prototype.EnableLimit=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cj(c,b);};G.prototype.GetLowerLimit=function(){return dj(this.Ut)};G.prototype.GetUpperLimit=function(){return ej(this.Ut)};
G.prototype.SetLimits=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);fj(d,b,c);};G.prototype.IsMotorEnabled=function(){return !!gj(this.Ut)};G.prototype.EnableMotor=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hj(c,b);};G.prototype.SetMotorSpeed=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ij(c,b);};G.prototype.GetMotorSpeed=function(){return jj(this.Ut)};
G.prototype.SetMaxMotorForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kj(c,b);};G.prototype.GetMaxMotorForce=function(){return lj(this.Ut)};G.prototype.GetMotorForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return mj(c,b)};G.prototype.GetType=function(){return nj(this.Ut)};G.prototype.GetBodyA=function(){return h(oj(this.Ut),l)};G.prototype.GetBodyB=function(){return h(pj(this.Ut),l)};G.prototype.GetAnchorA=function(){return h(qj(this.Ut),m)};
G.prototype.GetAnchorB=function(){return h(rj(this.Ut),m)};G.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(sj(c,b),m)};G.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return tj(c,b)};G.prototype.GetNext=function(){return h(uj(this.Ut),k)};G.prototype.GetUserData=function(){return vj(this.Ut)};G.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wj(c,b);};G.prototype.IsActive=function(){return !!xj(this.Ut)};
G.prototype.GetCollideConnected=function(){return !!yj(this.Ut)};G.prototype.__destroy__=function(){zj(this.Ut);};function Jw(){throw "cannot construct a b2RayCastOutput, no constructor in IDL";}Jw.prototype=Object.create(e.prototype);Jw.prototype.constructor=Jw;Jw.prototype.Vt=Jw;Jw.Wt={};a.b2RayCastOutput=Jw;Jw.prototype.get_normal=Jw.prototype.Ku=function(){return h(Aj(this.Ut),m)};Jw.prototype.set_normal=Jw.prototype.Zu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bj(c,b);};
Object.defineProperty(Jw.prototype,"normal",{get:Jw.prototype.Ku,set:Jw.prototype.Zu});Jw.prototype.get_fraction=Jw.prototype.Cv=function(){return Cj(this.Ut)};Jw.prototype.set_fraction=Jw.prototype.px=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Dj(c,b);};Object.defineProperty(Jw.prototype,"fraction",{get:Jw.prototype.Cv,set:Jw.prototype.px});Jw.prototype.__destroy__=function(){Ej(this.Ut);};function Kw(){throw "cannot construct a b2ContactID, no constructor in IDL";}Kw.prototype=Object.create(e.prototype);
Kw.prototype.constructor=Kw;Kw.prototype.Vt=Kw;Kw.Wt={};a.b2ContactID=Kw;Kw.prototype.get_cf=Kw.prototype.tv=function(){return h(Fj(this.Ut),z)};Kw.prototype.set_cf=Kw.prototype.gx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Gj(c,b);};Object.defineProperty(Kw.prototype,"cf",{get:Kw.prototype.tv,set:Kw.prototype.gx});Kw.prototype.get_key=Kw.prototype.Qv=function(){return Hj(this.Ut)};
Kw.prototype.set_key=Kw.prototype.Dx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ij(c,b);};Object.defineProperty(Kw.prototype,"key",{get:Kw.prototype.Qv,set:Kw.prototype.Dx});Kw.prototype.__destroy__=function(){Jj(this.Ut);};function Lw(){this.Ut=Kj();g(Lw)[this.Ut]=this;}Lw.prototype=Object.create(ww.prototype);Lw.prototype.constructor=Lw;Lw.prototype.Vt=Lw;Lw.Wt={};a.JSContactListener=Lw;Lw.prototype.BeginContact=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lj(c,b);};
Lw.prototype.EndContact=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Mj(c,b);};Lw.prototype.PreSolve=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Nj(d,b,c);};Lw.prototype.PostSolve=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Oj(d,b,c);};Lw.prototype.__destroy__=function(){Pj(this.Ut);};
function Mw(b,c,d,f){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);this.Ut=void 0===b?Qj():void 0===c?_emscripten_bind_b2Mat22_b2Mat22_1(b):void 0===d?Rj(b,c):void 0===f?_emscripten_bind_b2Mat22_b2Mat22_3(b,c,d):Sj(b,c,d,f);g(Mw)[this.Ut]=this;}Mw.prototype=Object.create(e.prototype);Mw.prototype.constructor=Mw;Mw.prototype.Vt=Mw;Mw.Wt={};a.b2Mat22=Mw;
Mw.prototype.Set=Mw.prototype.Set=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Tj(d,b,c);};Mw.prototype.SetIdentity=function(){Uj(this.Ut);};Mw.prototype.SetZero=function(){Vj(this.Ut);};Mw.prototype.GetInverse=function(){return h(Wj(this.Ut),Mw)};Mw.prototype.Solve=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Xj(c,b),m)};Mw.prototype.get_ex=Mw.prototype.Cu=function(){return h(Yj(this.Ut),m)};
Mw.prototype.set_ex=Mw.prototype.Ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zj(c,b);};Object.defineProperty(Mw.prototype,"ex",{get:Mw.prototype.Cu,set:Mw.prototype.Ru});Mw.prototype.get_ey=Mw.prototype.Du=function(){return h(ak(this.Ut),m)};Mw.prototype.set_ey=Mw.prototype.Su=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bk(c,b);};Object.defineProperty(Mw.prototype,"ey",{get:Mw.prototype.Du,set:Mw.prototype.Su});Mw.prototype.__destroy__=function(){ck(this.Ut);};
function H(){this.Ut=dk();g(H)[this.Ut]=this;}H.prototype=Object.create(n.prototype);H.prototype.constructor=H;H.prototype.Vt=H;H.Wt={};a.b2WheelJointDef=H;H.prototype.Initialize=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);ek(y,b,c,d,f);};H.prototype.get_localAnchorA=H.prototype.gu=function(){return h(fk(this.Ut),m)};
H.prototype.set_localAnchorA=H.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gk(c,b);};Object.defineProperty(H.prototype,"localAnchorA",{get:H.prototype.gu,set:H.prototype.iu});H.prototype.get_localAnchorB=H.prototype.hu=function(){return h(hk(this.Ut),m)};H.prototype.set_localAnchorB=H.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ik(c,b);};Object.defineProperty(H.prototype,"localAnchorB",{get:H.prototype.hu,set:H.prototype.ju});
H.prototype.get_localAxisA=H.prototype.Eu=function(){return h(jk(this.Ut),m)};H.prototype.set_localAxisA=H.prototype.Tu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kk(c,b);};Object.defineProperty(H.prototype,"localAxisA",{get:H.prototype.Eu,set:H.prototype.Tu});H.prototype.get_enableMotor=H.prototype.su=function(){return !!lk(this.Ut)};H.prototype.set_enableMotor=H.prototype.wu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mk(c,b);};
Object.defineProperty(H.prototype,"enableMotor",{get:H.prototype.su,set:H.prototype.wu});H.prototype.get_maxMotorTorque=H.prototype.Hu=function(){return nk(this.Ut)};H.prototype.set_maxMotorTorque=H.prototype.Wu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ok(c,b);};Object.defineProperty(H.prototype,"maxMotorTorque",{get:H.prototype.Hu,set:H.prototype.Wu});H.prototype.get_motorSpeed=H.prototype.uu=function(){return pk(this.Ut)};
H.prototype.set_motorSpeed=H.prototype.yu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qk(c,b);};Object.defineProperty(H.prototype,"motorSpeed",{get:H.prototype.uu,set:H.prototype.yu});H.prototype.get_frequencyHz=H.prototype.pu=function(){return rk(this.Ut)};H.prototype.set_frequencyHz=H.prototype.ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);sk(c,b);};Object.defineProperty(H.prototype,"frequencyHz",{get:H.prototype.pu,set:H.prototype.ru});
H.prototype.get_dampingRatio=H.prototype.ou=function(){return tk(this.Ut)};H.prototype.set_dampingRatio=H.prototype.qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);uk(c,b);};Object.defineProperty(H.prototype,"dampingRatio",{get:H.prototype.ou,set:H.prototype.qu});H.prototype.get_type=H.prototype.Xt=function(){return vk(this.Ut)};H.prototype.set_type=H.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wk(c,b);};
Object.defineProperty(H.prototype,"type",{get:H.prototype.Xt,set:H.prototype.Zt});H.prototype.get_userData=H.prototype.Yt=function(){return xk(this.Ut)};H.prototype.set_userData=H.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);yk(c,b);};Object.defineProperty(H.prototype,"userData",{get:H.prototype.Yt,set:H.prototype.$t});H.prototype.get_bodyA=H.prototype.au=function(){return h(zk(this.Ut),l)};
H.prototype.set_bodyA=H.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ak(c,b);};Object.defineProperty(H.prototype,"bodyA",{get:H.prototype.au,set:H.prototype.du});H.prototype.get_bodyB=H.prototype.bu=function(){return h(Bk(this.Ut),l)};H.prototype.set_bodyB=H.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ck(c,b);};Object.defineProperty(H.prototype,"bodyB",{get:H.prototype.bu,set:H.prototype.eu});H.prototype.get_collideConnected=H.prototype.cu=function(){return !!Dk(this.Ut)};
H.prototype.set_collideConnected=H.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ek(c,b);};Object.defineProperty(H.prototype,"collideConnected",{get:H.prototype.cu,set:H.prototype.fu});H.prototype.__destroy__=function(){Fk(this.Ut);};function I(){this.Ut=Gk();g(I)[this.Ut]=this;}I.prototype=Object.create(p.prototype);I.prototype.constructor=I;I.prototype.Vt=I;I.Wt={};a.b2CircleShape=I;I.prototype.GetType=function(){return Hk(this.Ut)};I.prototype.GetChildCount=function(){return Ik(this.Ut)};
I.prototype.TestPoint=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!Jk(d,b,c)};I.prototype.RayCast=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return !!Kk(y,b,c,d,f)};
I.prototype.ComputeAABB=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Lk(f,b,c,d);};I.prototype.ComputeMass=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Mk(d,b,c);};I.prototype.get_m_p=I.prototype.gw=function(){return h(Nk(this.Ut),m)};I.prototype.set_m_p=I.prototype.Ux=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ok(c,b);};
Object.defineProperty(I.prototype,"m_p",{get:I.prototype.gw,set:I.prototype.Ux});I.prototype.get_m_type=I.prototype.lu=function(){return Pk(this.Ut)};I.prototype.set_m_type=I.prototype.nu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Qk(c,b);};Object.defineProperty(I.prototype,"m_type",{get:I.prototype.lu,set:I.prototype.nu});I.prototype.get_m_radius=I.prototype.ku=function(){return Rk(this.Ut)};
I.prototype.set_m_radius=I.prototype.mu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Sk(c,b);};Object.defineProperty(I.prototype,"m_radius",{get:I.prototype.ku,set:I.prototype.mu});I.prototype.__destroy__=function(){Tk(this.Ut);};function J(){this.Ut=Uk();g(J)[this.Ut]=this;}J.prototype=Object.create(n.prototype);J.prototype.constructor=J;J.prototype.Vt=J;J.Wt={};a.b2WeldJointDef=J;
J.prototype.Initialize=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Vk(f,b,c,d);};J.prototype.get_localAnchorA=J.prototype.gu=function(){return h(Wk(this.Ut),m)};J.prototype.set_localAnchorA=J.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xk(c,b);};Object.defineProperty(J.prototype,"localAnchorA",{get:J.prototype.gu,set:J.prototype.iu});
J.prototype.get_localAnchorB=J.prototype.hu=function(){return h(Yk(this.Ut),m)};J.prototype.set_localAnchorB=J.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zk(c,b);};Object.defineProperty(J.prototype,"localAnchorB",{get:J.prototype.hu,set:J.prototype.ju});J.prototype.get_referenceAngle=J.prototype.vu=function(){return $k(this.Ut)};J.prototype.set_referenceAngle=J.prototype.zu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);al(c,b);};
Object.defineProperty(J.prototype,"referenceAngle",{get:J.prototype.vu,set:J.prototype.zu});J.prototype.get_frequencyHz=J.prototype.pu=function(){return bl(this.Ut)};J.prototype.set_frequencyHz=J.prototype.ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cl(c,b);};Object.defineProperty(J.prototype,"frequencyHz",{get:J.prototype.pu,set:J.prototype.ru});J.prototype.get_dampingRatio=J.prototype.ou=function(){return dl(this.Ut)};
J.prototype.set_dampingRatio=J.prototype.qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);el(c,b);};Object.defineProperty(J.prototype,"dampingRatio",{get:J.prototype.ou,set:J.prototype.qu});J.prototype.get_type=J.prototype.Xt=function(){return fl(this.Ut)};J.prototype.set_type=J.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gl(c,b);};Object.defineProperty(J.prototype,"type",{get:J.prototype.Xt,set:J.prototype.Zt});J.prototype.get_userData=J.prototype.Yt=function(){return hl(this.Ut)};
J.prototype.set_userData=J.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);il(c,b);};Object.defineProperty(J.prototype,"userData",{get:J.prototype.Yt,set:J.prototype.$t});J.prototype.get_bodyA=J.prototype.au=function(){return h(jl(this.Ut),l)};J.prototype.set_bodyA=J.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kl(c,b);};Object.defineProperty(J.prototype,"bodyA",{get:J.prototype.au,set:J.prototype.du});
J.prototype.get_bodyB=J.prototype.bu=function(){return h(ll(this.Ut),l)};J.prototype.set_bodyB=J.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ml(c,b);};Object.defineProperty(J.prototype,"bodyB",{get:J.prototype.bu,set:J.prototype.eu});J.prototype.get_collideConnected=J.prototype.cu=function(){return !!nl(this.Ut)};J.prototype.set_collideConnected=J.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ol(c,b);};
Object.defineProperty(J.prototype,"collideConnected",{get:J.prototype.cu,set:J.prototype.fu});J.prototype.__destroy__=function(){pl(this.Ut);};function Nw(){this.Ut=ql();g(Nw)[this.Ut]=this;}Nw.prototype=Object.create(e.prototype);Nw.prototype.constructor=Nw;Nw.prototype.Vt=Nw;Nw.Wt={};a.b2MassData=Nw;Nw.prototype.get_mass=Nw.prototype.ow=function(){return rl(this.Ut)};Nw.prototype.set_mass=Nw.prototype.by=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);sl(c,b);};
Object.defineProperty(Nw.prototype,"mass",{get:Nw.prototype.ow,set:Nw.prototype.by});Nw.prototype.get_center=Nw.prototype.sv=function(){return h(tl(this.Ut),m)};Nw.prototype.set_center=Nw.prototype.fx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ul(c,b);};Object.defineProperty(Nw.prototype,"center",{get:Nw.prototype.sv,set:Nw.prototype.fx});Nw.prototype.get_I=Nw.prototype.fv=function(){return vl(this.Ut)};
Nw.prototype.set_I=Nw.prototype.Tw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wl(c,b);};Object.defineProperty(Nw.prototype,"I",{get:Nw.prototype.fv,set:Nw.prototype.Tw});Nw.prototype.__destroy__=function(){xl(this.Ut);};function Ow(){throw "cannot construct a b2GearJoint, no constructor in IDL";}Ow.prototype=Object.create(k.prototype);Ow.prototype.constructor=Ow;Ow.prototype.Vt=Ow;Ow.Wt={};a.b2GearJoint=Ow;Ow.prototype.GetJoint1=function(){return h(yl(this.Ut),k)};
Ow.prototype.GetJoint2=function(){return h(zl(this.Ut),k)};Ow.prototype.SetRatio=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Al(c,b);};Ow.prototype.GetRatio=function(){return Bl(this.Ut)};Ow.prototype.GetType=function(){return Cl(this.Ut)};Ow.prototype.GetBodyA=function(){return h(Dl(this.Ut),l)};Ow.prototype.GetBodyB=function(){return h(El(this.Ut),l)};Ow.prototype.GetAnchorA=function(){return h(Fl(this.Ut),m)};Ow.prototype.GetAnchorB=function(){return h(Gl(this.Ut),m)};
Ow.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Hl(c,b),m)};Ow.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return Il(c,b)};Ow.prototype.GetNext=function(){return h(Jl(this.Ut),k)};Ow.prototype.GetUserData=function(){return Kl(this.Ut)};Ow.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ll(c,b);};Ow.prototype.IsActive=function(){return !!Ml(this.Ut)};
Ow.prototype.GetCollideConnected=function(){return !!Nl(this.Ut)};Ow.prototype.__destroy__=function(){Ol(this.Ut);};function Pw(){throw "cannot construct a b2WeldJoint, no constructor in IDL";}Pw.prototype=Object.create(k.prototype);Pw.prototype.constructor=Pw;Pw.prototype.Vt=Pw;Pw.Wt={};a.b2WeldJoint=Pw;Pw.prototype.GetLocalAnchorA=function(){return h(Pl(this.Ut),m)};Pw.prototype.GetLocalAnchorB=function(){return h(Ql(this.Ut),m)};
Pw.prototype.SetFrequency=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Rl(c,b);};Pw.prototype.GetFrequency=function(){return Sl(this.Ut)};Pw.prototype.SetDampingRatio=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Tl(c,b);};Pw.prototype.GetDampingRatio=function(){return Ul(this.Ut)};Pw.prototype.Dump=function(){Vl(this.Ut);};Pw.prototype.GetType=function(){return Wl(this.Ut)};Pw.prototype.GetBodyA=function(){return h(Xl(this.Ut),l)};
Pw.prototype.GetBodyB=function(){return h(Yl(this.Ut),l)};Pw.prototype.GetAnchorA=function(){return h(Zl(this.Ut),m)};Pw.prototype.GetAnchorB=function(){return h($l(this.Ut),m)};Pw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(am(c,b),m)};Pw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return bm(c,b)};Pw.prototype.GetNext=function(){return h(cm(this.Ut),k)};Pw.prototype.GetUserData=function(){return dm(this.Ut)};
Pw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);em(c,b);};Pw.prototype.IsActive=function(){return !!fm(this.Ut)};Pw.prototype.GetCollideConnected=function(){return !!gm(this.Ut)};Pw.prototype.__destroy__=function(){hm(this.Ut);};function K(){this.Ut=im();g(K)[this.Ut]=this;}K.prototype=Object.create(e.prototype);K.prototype.constructor=K;K.prototype.Vt=K;K.Wt={};a.b2JointEdge=K;K.prototype.get_other=K.prototype.Lu=function(){return h(jm(this.Ut),l)};
K.prototype.set_other=K.prototype.$u=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);km(c,b);};Object.defineProperty(K.prototype,"other",{get:K.prototype.Lu,set:K.prototype.$u});K.prototype.get_joint=K.prototype.Nv=function(){return h(lm(this.Ut),k)};K.prototype.set_joint=K.prototype.Ax=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mm(c,b);};Object.defineProperty(K.prototype,"joint",{get:K.prototype.Nv,set:K.prototype.Ax});
K.prototype.get_prev=K.prototype.Mu=function(){return h(nm(this.Ut),K)};K.prototype.set_prev=K.prototype.av=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);om(c,b);};Object.defineProperty(K.prototype,"prev",{get:K.prototype.Mu,set:K.prototype.av});K.prototype.get_next=K.prototype.Ju=function(){return h(pm(this.Ut),K)};K.prototype.set_next=K.prototype.Yu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qm(c,b);};Object.defineProperty(K.prototype,"next",{get:K.prototype.Ju,set:K.prototype.Yu});
K.prototype.__destroy__=function(){rm(this.Ut);};function L(){this.Ut=sm();g(L)[this.Ut]=this;}L.prototype=Object.create(n.prototype);L.prototype.constructor=L;L.prototype.Vt=L;L.Wt={};a.b2PulleyJointDef=L;
L.prototype.Initialize=function(b,c,d,f,y,oa,ya){var ab=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);y&&"object"===typeof y&&(y=y.Ut);oa&&"object"===typeof oa&&(oa=oa.Ut);ya&&"object"===typeof ya&&(ya=ya.Ut);tm(ab,b,c,d,f,y,oa,ya);};L.prototype.get_groundAnchorA=L.prototype.Gv=function(){return h(um(this.Ut),m)};
L.prototype.set_groundAnchorA=L.prototype.tx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wm(c,b);};Object.defineProperty(L.prototype,"groundAnchorA",{get:L.prototype.Gv,set:L.prototype.tx});L.prototype.get_groundAnchorB=L.prototype.Hv=function(){return h(xm(this.Ut),m)};L.prototype.set_groundAnchorB=L.prototype.ux=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ym(c,b);};Object.defineProperty(L.prototype,"groundAnchorB",{get:L.prototype.Hv,set:L.prototype.ux});
L.prototype.get_localAnchorA=L.prototype.gu=function(){return h(zm(this.Ut),m)};L.prototype.set_localAnchorA=L.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Am(c,b);};Object.defineProperty(L.prototype,"localAnchorA",{get:L.prototype.gu,set:L.prototype.iu});L.prototype.get_localAnchorB=L.prototype.hu=function(){return h(Bm(this.Ut),m)};L.prototype.set_localAnchorB=L.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Cm(c,b);};
Object.defineProperty(L.prototype,"localAnchorB",{get:L.prototype.hu,set:L.prototype.ju});L.prototype.get_lengthA=L.prototype.Sv=function(){return Dm(this.Ut)};L.prototype.set_lengthA=L.prototype.Fx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Em(c,b);};Object.defineProperty(L.prototype,"lengthA",{get:L.prototype.Sv,set:L.prototype.Fx});L.prototype.get_lengthB=L.prototype.Tv=function(){return Fm(this.Ut)};
L.prototype.set_lengthB=L.prototype.Gx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Gm(c,b);};Object.defineProperty(L.prototype,"lengthB",{get:L.prototype.Tv,set:L.prototype.Gx});L.prototype.get_ratio=L.prototype.Nu=function(){return Hm(this.Ut)};L.prototype.set_ratio=L.prototype.bv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Im(c,b);};Object.defineProperty(L.prototype,"ratio",{get:L.prototype.Nu,set:L.prototype.bv});L.prototype.get_type=L.prototype.Xt=function(){return Jm(this.Ut)};
L.prototype.set_type=L.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Km(c,b);};Object.defineProperty(L.prototype,"type",{get:L.prototype.Xt,set:L.prototype.Zt});L.prototype.get_userData=L.prototype.Yt=function(){return Lm(this.Ut)};L.prototype.set_userData=L.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Mm(c,b);};Object.defineProperty(L.prototype,"userData",{get:L.prototype.Yt,set:L.prototype.$t});
L.prototype.get_bodyA=L.prototype.au=function(){return h(Nm(this.Ut),l)};L.prototype.set_bodyA=L.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Om(c,b);};Object.defineProperty(L.prototype,"bodyA",{get:L.prototype.au,set:L.prototype.du});L.prototype.get_bodyB=L.prototype.bu=function(){return h(Pm(this.Ut),l)};L.prototype.set_bodyB=L.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Qm(c,b);};
Object.defineProperty(L.prototype,"bodyB",{get:L.prototype.bu,set:L.prototype.eu});L.prototype.get_collideConnected=L.prototype.cu=function(){return !!Rm(this.Ut)};L.prototype.set_collideConnected=L.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Sm(c,b);};Object.defineProperty(L.prototype,"collideConnected",{get:L.prototype.cu,set:L.prototype.fu});L.prototype.__destroy__=function(){Tm(this.Ut);};function M(){this.Ut=Um();g(M)[this.Ut]=this;}M.prototype=Object.create(e.prototype);
M.prototype.constructor=M;M.prototype.Vt=M;M.Wt={};a.b2ManifoldPoint=M;M.prototype.get_localPoint=M.prototype.Fu=function(){return h(Vm(this.Ut),m)};M.prototype.set_localPoint=M.prototype.Uu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Wm(c,b);};Object.defineProperty(M.prototype,"localPoint",{get:M.prototype.Fu,set:M.prototype.Uu});M.prototype.get_normalImpulse=M.prototype.sw=function(){return Xm(this.Ut)};
M.prototype.set_normalImpulse=M.prototype.fy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ym(c,b);};Object.defineProperty(M.prototype,"normalImpulse",{get:M.prototype.sw,set:M.prototype.fy});M.prototype.get_tangentImpulse=M.prototype.Lw=function(){return Zm(this.Ut)};M.prototype.set_tangentImpulse=M.prototype.yy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);$m(c,b);};Object.defineProperty(M.prototype,"tangentImpulse",{get:M.prototype.Lw,set:M.prototype.yy});
M.prototype.get_id=M.prototype.Jv=function(){return h(an(this.Ut),Kw)};M.prototype.set_id=M.prototype.wx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bn(c,b);};Object.defineProperty(M.prototype,"id",{get:M.prototype.Jv,set:M.prototype.wx});M.prototype.__destroy__=function(){cn(this.Ut);};function Qw(b,c){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);this.Ut=void 0===b?dn():void 0===c?_emscripten_bind_b2Transform_b2Transform_1(b):en(b,c);g(Qw)[this.Ut]=this;}
Qw.prototype=Object.create(e.prototype);Qw.prototype.constructor=Qw;Qw.prototype.Vt=Qw;Qw.Wt={};a.b2Transform=Qw;Qw.prototype.SetIdentity=function(){fn(this.Ut);};Qw.prototype.Set=Qw.prototype.Set=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);gn(d,b,c);};Qw.prototype.get_p=Qw.prototype.tw=function(){return h(hn(this.Ut),m)};Qw.prototype.set_p=Qw.prototype.gy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);jn(c,b);};
Object.defineProperty(Qw.prototype,"p",{get:Qw.prototype.tw,set:Qw.prototype.gy});Qw.prototype.get_q=Qw.prototype.zw=function(){return h(kn(this.Ut),Ew)};Qw.prototype.set_q=Qw.prototype.my=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ln(c,b);};Object.defineProperty(Qw.prototype,"q",{get:Qw.prototype.zw,set:Qw.prototype.my});Qw.prototype.__destroy__=function(){mn(this.Ut);};function N(){this.Ut=nn();g(N)[this.Ut]=this;}N.prototype=Object.create(p.prototype);N.prototype.constructor=N;
N.prototype.Vt=N;N.Wt={};a.b2ChainShape=N;N.prototype.Clear=function(){on(this.Ut);};N.prototype.CreateLoop=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);pn(d,b,c);};N.prototype.CreateChain=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);qn(d,b,c);};N.prototype.SetPrevVertex=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rn(c,b);};
N.prototype.SetNextVertex=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);sn(c,b);};N.prototype.GetChildEdge=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);tn(d,b,c);};N.prototype.GetType=function(){return un(this.Ut)};N.prototype.GetChildCount=function(){return vn(this.Ut)};N.prototype.TestPoint=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!wn(d,b,c)};
N.prototype.RayCast=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return !!xn(y,b,c,d,f)};N.prototype.ComputeAABB=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);yn(f,b,c,d);};N.prototype.ComputeMass=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);zn(d,b,c);};
N.prototype.get_m_vertices=N.prototype.mw=function(){return h(An(this.Ut),m)};N.prototype.set_m_vertices=N.prototype.$x=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bn(c,b);};Object.defineProperty(N.prototype,"m_vertices",{get:N.prototype.mw,set:N.prototype.$x});N.prototype.get_m_count=N.prototype.Gu=function(){return Cn(this.Ut)};N.prototype.set_m_count=N.prototype.Vu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Dn(c,b);};
Object.defineProperty(N.prototype,"m_count",{get:N.prototype.Gu,set:N.prototype.Vu});N.prototype.get_m_prevVertex=N.prototype.hw=function(){return h(En(this.Ut),m)};N.prototype.set_m_prevVertex=N.prototype.Vx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fn(c,b);};Object.defineProperty(N.prototype,"m_prevVertex",{get:N.prototype.hw,set:N.prototype.Vx});N.prototype.get_m_nextVertex=N.prototype.fw=function(){return h(Gn(this.Ut),m)};
N.prototype.set_m_nextVertex=N.prototype.Tx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hn(c,b);};Object.defineProperty(N.prototype,"m_nextVertex",{get:N.prototype.fw,set:N.prototype.Tx});N.prototype.get_m_hasPrevVertex=N.prototype.cw=function(){return !!In(this.Ut)};N.prototype.set_m_hasPrevVertex=N.prototype.Qx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jn(c,b);};Object.defineProperty(N.prototype,"m_hasPrevVertex",{get:N.prototype.cw,set:N.prototype.Qx});
N.prototype.get_m_hasNextVertex=N.prototype.bw=function(){return !!Kn(this.Ut)};N.prototype.set_m_hasNextVertex=N.prototype.Px=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ln(c,b);};Object.defineProperty(N.prototype,"m_hasNextVertex",{get:N.prototype.bw,set:N.prototype.Px});N.prototype.get_m_type=N.prototype.lu=function(){return Mn(this.Ut)};N.prototype.set_m_type=N.prototype.nu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nn(c,b);};
Object.defineProperty(N.prototype,"m_type",{get:N.prototype.lu,set:N.prototype.nu});N.prototype.get_m_radius=N.prototype.ku=function(){return On(this.Ut)};N.prototype.set_m_radius=N.prototype.mu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Pn(c,b);};Object.defineProperty(N.prototype,"m_radius",{get:N.prototype.ku,set:N.prototype.mu});N.prototype.__destroy__=function(){Qn(this.Ut);};
function O(b,c,d){b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);this.Ut=void 0===b?Rn():void 0===c?_emscripten_bind_b2Color_b2Color_1(b):void 0===d?_emscripten_bind_b2Color_b2Color_2(b,c):Sn(b,c,d);g(O)[this.Ut]=this;}O.prototype=Object.create(e.prototype);O.prototype.constructor=O;O.prototype.Vt=O;O.Wt={};a.b2Color=O;
O.prototype.Set=O.prototype.Set=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Tn(f,b,c,d);};O.prototype.get_r=O.prototype.Aw=function(){return Un(this.Ut)};O.prototype.set_r=O.prototype.ny=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vn(c,b);};Object.defineProperty(O.prototype,"r",{get:O.prototype.Aw,set:O.prototype.ny});O.prototype.get_g=O.prototype.Ev=function(){return Wn(this.Ut)};
O.prototype.set_g=O.prototype.rx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xn(c,b);};Object.defineProperty(O.prototype,"g",{get:O.prototype.Ev,set:O.prototype.rx});O.prototype.get_b=O.prototype.nv=function(){return Yn(this.Ut)};O.prototype.set_b=O.prototype.ax=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zn(c,b);};Object.defineProperty(O.prototype,"b",{get:O.prototype.nv,set:O.prototype.ax});O.prototype.__destroy__=function(){$n(this.Ut);};
function Rw(){throw "cannot construct a b2RopeJoint, no constructor in IDL";}Rw.prototype=Object.create(k.prototype);Rw.prototype.constructor=Rw;Rw.prototype.Vt=Rw;Rw.Wt={};a.b2RopeJoint=Rw;Rw.prototype.GetLocalAnchorA=function(){return h(ao(this.Ut),m)};Rw.prototype.GetLocalAnchorB=function(){return h(bo(this.Ut),m)};Rw.prototype.SetMaxLength=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);co(c,b);};Rw.prototype.GetMaxLength=function(){return eo(this.Ut)};Rw.prototype.GetLimitState=function(){return fo(this.Ut)};
Rw.prototype.GetType=function(){return go(this.Ut)};Rw.prototype.GetBodyA=function(){return h(ho(this.Ut),l)};Rw.prototype.GetBodyB=function(){return h(io(this.Ut),l)};Rw.prototype.GetAnchorA=function(){return h(jo(this.Ut),m)};Rw.prototype.GetAnchorB=function(){return h(ko(this.Ut),m)};Rw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(lo(c,b),m)};Rw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return mo(c,b)};
Rw.prototype.GetNext=function(){return h(no(this.Ut),k)};Rw.prototype.GetUserData=function(){return oo(this.Ut)};Rw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);po(c,b);};Rw.prototype.IsActive=function(){return !!qo(this.Ut)};Rw.prototype.GetCollideConnected=function(){return !!ro(this.Ut)};Rw.prototype.__destroy__=function(){so(this.Ut);};function Sw(){throw "cannot construct a b2RayCastInput, no constructor in IDL";}Sw.prototype=Object.create(e.prototype);
Sw.prototype.constructor=Sw;Sw.prototype.Vt=Sw;Sw.Wt={};a.b2RayCastInput=Sw;Sw.prototype.get_p1=Sw.prototype.uw=function(){return h(to(this.Ut),m)};Sw.prototype.set_p1=Sw.prototype.hy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);uo(c,b);};Object.defineProperty(Sw.prototype,"p1",{get:Sw.prototype.uw,set:Sw.prototype.hy});Sw.prototype.get_p2=Sw.prototype.vw=function(){return h(vo(this.Ut),m)};
Sw.prototype.set_p2=Sw.prototype.iy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wo(c,b);};Object.defineProperty(Sw.prototype,"p2",{get:Sw.prototype.vw,set:Sw.prototype.iy});Sw.prototype.get_maxFraction=Sw.prototype.pw=function(){return xo(this.Ut)};Sw.prototype.set_maxFraction=Sw.prototype.cy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);yo(c,b);};Object.defineProperty(Sw.prototype,"maxFraction",{get:Sw.prototype.pw,set:Sw.prototype.cy});Sw.prototype.__destroy__=function(){zo(this.Ut);};
function P(){this.Ut=Ao();g(P)[this.Ut]=this;}P.prototype=Object.create(p.prototype);P.prototype.constructor=P;P.prototype.Vt=P;P.Wt={};a.b2PolygonShape=P;P.prototype.Set=P.prototype.Set=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Bo(d,b,c);};
P.prototype.SetAsBox=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);void 0===d?Co(y,b,c):void 0===f?_emscripten_bind_b2PolygonShape_SetAsBox_3(y,b,c,d):Do(y,b,c,d,f);};P.prototype.GetVertexCount=function(){return Eo(this.Ut)};P.prototype.GetVertex=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Fo(c,b),m)};P.prototype.GetType=function(){return Go(this.Ut)};
P.prototype.GetChildCount=function(){return Ho(this.Ut)};P.prototype.TestPoint=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!Io(d,b,c)};P.prototype.RayCast=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return !!Jo(y,b,c,d,f)};
P.prototype.ComputeAABB=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Ko(f,b,c,d);};P.prototype.ComputeMass=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Lo(d,b,c);};P.prototype.get_m_centroid=P.prototype.aw=function(){return h(Mo(this.Ut),m)};P.prototype.set_m_centroid=P.prototype.Ox=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);No(c,b);};
Object.defineProperty(P.prototype,"m_centroid",{get:P.prototype.aw,set:P.prototype.Ox});P.prototype.get_m_count=P.prototype.Gu=function(){return Oo(this.Ut)};P.prototype.set_m_count=P.prototype.Vu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Po(c,b);};Object.defineProperty(P.prototype,"m_count",{get:P.prototype.Gu,set:P.prototype.Vu});P.prototype.get_m_type=P.prototype.lu=function(){return Qo(this.Ut)};
P.prototype.set_m_type=P.prototype.nu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ro(c,b);};Object.defineProperty(P.prototype,"m_type",{get:P.prototype.lu,set:P.prototype.nu});P.prototype.get_m_radius=P.prototype.ku=function(){return So(this.Ut)};P.prototype.set_m_radius=P.prototype.mu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);To(c,b);};Object.defineProperty(P.prototype,"m_radius",{get:P.prototype.ku,set:P.prototype.mu});P.prototype.__destroy__=function(){Uo(this.Ut);};
function Q(){this.Ut=Vo();g(Q)[this.Ut]=this;}Q.prototype=Object.create(p.prototype);Q.prototype.constructor=Q;Q.prototype.Vt=Q;Q.Wt={};a.b2EdgeShape=Q;Q.prototype.Set=Q.prototype.Set=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Wo(d,b,c);};Q.prototype.GetType=function(){return Xo(this.Ut)};Q.prototype.GetChildCount=function(){return Yo(this.Ut)};
Q.prototype.TestPoint=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!Zo(d,b,c)};Q.prototype.RayCast=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);return !!$o(y,b,c,d,f)};
Q.prototype.ComputeAABB=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);ap(f,b,c,d);};Q.prototype.ComputeMass=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);bp(d,b,c);};Q.prototype.get_m_vertex1=Q.prototype.jw=function(){return h(cp(this.Ut),m)};Q.prototype.set_m_vertex1=Q.prototype.Xx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dp(c,b);};
Object.defineProperty(Q.prototype,"m_vertex1",{get:Q.prototype.jw,set:Q.prototype.Xx});Q.prototype.get_m_vertex2=Q.prototype.kw=function(){return h(ep(this.Ut),m)};Q.prototype.set_m_vertex2=Q.prototype.Yx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fp(c,b);};Object.defineProperty(Q.prototype,"m_vertex2",{get:Q.prototype.kw,set:Q.prototype.Yx});Q.prototype.get_m_vertex0=Q.prototype.iw=function(){return h(gp(this.Ut),m)};
Q.prototype.set_m_vertex0=Q.prototype.Wx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hp(c,b);};Object.defineProperty(Q.prototype,"m_vertex0",{get:Q.prototype.iw,set:Q.prototype.Wx});Q.prototype.get_m_vertex3=Q.prototype.lw=function(){return h(ip(this.Ut),m)};Q.prototype.set_m_vertex3=Q.prototype.Zx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);jp(c,b);};Object.defineProperty(Q.prototype,"m_vertex3",{get:Q.prototype.lw,set:Q.prototype.Zx});
Q.prototype.get_m_hasVertex0=Q.prototype.dw=function(){return !!kp(this.Ut)};Q.prototype.set_m_hasVertex0=Q.prototype.Rx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);lp(c,b);};Object.defineProperty(Q.prototype,"m_hasVertex0",{get:Q.prototype.dw,set:Q.prototype.Rx});Q.prototype.get_m_hasVertex3=Q.prototype.ew=function(){return !!mp(this.Ut)};Q.prototype.set_m_hasVertex3=Q.prototype.Sx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);np(c,b);};
Object.defineProperty(Q.prototype,"m_hasVertex3",{get:Q.prototype.ew,set:Q.prototype.Sx});Q.prototype.get_m_type=Q.prototype.lu=function(){return op(this.Ut)};Q.prototype.set_m_type=Q.prototype.nu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);pp(c,b);};Object.defineProperty(Q.prototype,"m_type",{get:Q.prototype.lu,set:Q.prototype.nu});Q.prototype.get_m_radius=Q.prototype.ku=function(){return qp(this.Ut)};
Q.prototype.set_m_radius=Q.prototype.mu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rp(c,b);};Object.defineProperty(Q.prototype,"m_radius",{get:Q.prototype.ku,set:Q.prototype.mu});Q.prototype.__destroy__=function(){sp(this.Ut);};function Tw(){this.Ut=tp();g(Tw)[this.Ut]=this;}Tw.prototype=Object.create(yw.prototype);Tw.prototype.constructor=Tw;Tw.prototype.Vt=Tw;Tw.Wt={};a.JSContactFilter=Tw;
Tw.prototype.ShouldCollide=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return !!up(d,b,c)};Tw.prototype.__destroy__=function(){vp(this.Ut);};function R(){this.Ut=wp();g(R)[this.Ut]=this;}R.prototype=Object.create(n.prototype);R.prototype.constructor=R;R.prototype.Vt=R;R.Wt={};a.b2RevoluteJointDef=R;
R.prototype.Initialize=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);xp(f,b,c,d);};R.prototype.get_localAnchorA=R.prototype.gu=function(){return h(yp(this.Ut),m)};R.prototype.set_localAnchorA=R.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);zp(c,b);};Object.defineProperty(R.prototype,"localAnchorA",{get:R.prototype.gu,set:R.prototype.iu});
R.prototype.get_localAnchorB=R.prototype.hu=function(){return h(Ap(this.Ut),m)};R.prototype.set_localAnchorB=R.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Bp(c,b);};Object.defineProperty(R.prototype,"localAnchorB",{get:R.prototype.hu,set:R.prototype.ju});R.prototype.get_referenceAngle=R.prototype.vu=function(){return Cp(this.Ut)};R.prototype.set_referenceAngle=R.prototype.zu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Dp(c,b);};
Object.defineProperty(R.prototype,"referenceAngle",{get:R.prototype.vu,set:R.prototype.zu});R.prototype.get_enableLimit=R.prototype.Bu=function(){return !!Ep(this.Ut)};R.prototype.set_enableLimit=R.prototype.Qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Fp(c,b);};Object.defineProperty(R.prototype,"enableLimit",{get:R.prototype.Bu,set:R.prototype.Qu});R.prototype.get_lowerAngle=R.prototype.Yv=function(){return Gp(this.Ut)};
R.prototype.set_lowerAngle=R.prototype.Lx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hp(c,b);};Object.defineProperty(R.prototype,"lowerAngle",{get:R.prototype.Yv,set:R.prototype.Lx});R.prototype.get_upperAngle=R.prototype.Pw=function(){return Ip(this.Ut)};R.prototype.set_upperAngle=R.prototype.Cy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Jp(c,b);};Object.defineProperty(R.prototype,"upperAngle",{get:R.prototype.Pw,set:R.prototype.Cy});
R.prototype.get_enableMotor=R.prototype.su=function(){return !!Kp(this.Ut)};R.prototype.set_enableMotor=R.prototype.wu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lp(c,b);};Object.defineProperty(R.prototype,"enableMotor",{get:R.prototype.su,set:R.prototype.wu});R.prototype.get_motorSpeed=R.prototype.uu=function(){return Mp(this.Ut)};R.prototype.set_motorSpeed=R.prototype.yu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Np(c,b);};
Object.defineProperty(R.prototype,"motorSpeed",{get:R.prototype.uu,set:R.prototype.yu});R.prototype.get_maxMotorTorque=R.prototype.Hu=function(){return Op(this.Ut)};R.prototype.set_maxMotorTorque=R.prototype.Wu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Pp(c,b);};Object.defineProperty(R.prototype,"maxMotorTorque",{get:R.prototype.Hu,set:R.prototype.Wu});R.prototype.get_type=R.prototype.Xt=function(){return Qp(this.Ut)};
R.prototype.set_type=R.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Rp(c,b);};Object.defineProperty(R.prototype,"type",{get:R.prototype.Xt,set:R.prototype.Zt});R.prototype.get_userData=R.prototype.Yt=function(){return Sp(this.Ut)};R.prototype.set_userData=R.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Tp(c,b);};Object.defineProperty(R.prototype,"userData",{get:R.prototype.Yt,set:R.prototype.$t});
R.prototype.get_bodyA=R.prototype.au=function(){return h(Up(this.Ut),l)};R.prototype.set_bodyA=R.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vp(c,b);};Object.defineProperty(R.prototype,"bodyA",{get:R.prototype.au,set:R.prototype.du});R.prototype.get_bodyB=R.prototype.bu=function(){return h(Wp(this.Ut),l)};R.prototype.set_bodyB=R.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xp(c,b);};
Object.defineProperty(R.prototype,"bodyB",{get:R.prototype.bu,set:R.prototype.eu});R.prototype.get_collideConnected=R.prototype.cu=function(){return !!Yp(this.Ut)};R.prototype.set_collideConnected=R.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zp(c,b);};Object.defineProperty(R.prototype,"collideConnected",{get:R.prototype.cu,set:R.prototype.fu});R.prototype.__destroy__=function(){$p(this.Ut);};function Uw(){this.Ut=aq();g(Uw)[this.Ut]=this;}Uw.prototype=Object.create(uw.prototype);
Uw.prototype.constructor=Uw;Uw.prototype.Vt=Uw;Uw.Wt={};a.JSDraw=Uw;Uw.prototype.DrawPolygon=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);bq(f,b,c,d);};Uw.prototype.DrawSolidPolygon=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);cq(f,b,c,d);};
Uw.prototype.DrawCircle=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);dq(f,b,c,d);};Uw.prototype.DrawSolidCircle=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);eq(y,b,c,d,f);};
Uw.prototype.DrawSegment=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);fq(f,b,c,d);};Uw.prototype.DrawTransform=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gq(c,b);};Uw.prototype.__destroy__=function(){hq(this.Ut);};function S(){throw "cannot construct a b2WheelJoint, no constructor in IDL";}S.prototype=Object.create(k.prototype);S.prototype.constructor=S;S.prototype.Vt=S;S.Wt={};a.b2WheelJoint=S;
S.prototype.GetLocalAnchorA=function(){return h(iq(this.Ut),m)};S.prototype.GetLocalAnchorB=function(){return h(jq(this.Ut),m)};S.prototype.GetLocalAxisA=function(){return h(kq(this.Ut),m)};S.prototype.GetJointTranslation=function(){return lq(this.Ut)};S.prototype.GetJointSpeed=function(){return mq(this.Ut)};S.prototype.IsMotorEnabled=function(){return !!nq(this.Ut)};S.prototype.EnableMotor=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);oq(c,b);};
S.prototype.SetMotorSpeed=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);pq(c,b);};S.prototype.GetMotorSpeed=function(){return qq(this.Ut)};S.prototype.SetMaxMotorTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);rq(c,b);};S.prototype.GetMaxMotorTorque=function(){return sq(this.Ut)};S.prototype.GetMotorTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return tq(c,b)};
S.prototype.SetSpringFrequencyHz=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);uq(c,b);};S.prototype.GetSpringFrequencyHz=function(){return vq(this.Ut)};S.prototype.SetSpringDampingRatio=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wq(c,b);};S.prototype.GetSpringDampingRatio=function(){return xq(this.Ut)};S.prototype.GetType=function(){return yq(this.Ut)};S.prototype.GetBodyA=function(){return h(zq(this.Ut),l)};S.prototype.GetBodyB=function(){return h(Aq(this.Ut),l)};
S.prototype.GetAnchorA=function(){return h(Bq(this.Ut),m)};S.prototype.GetAnchorB=function(){return h(Cq(this.Ut),m)};S.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Dq(c,b),m)};S.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return Eq(c,b)};S.prototype.GetNext=function(){return h(Fq(this.Ut),k)};S.prototype.GetUserData=function(){return Gq(this.Ut)};
S.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Hq(c,b);};S.prototype.IsActive=function(){return !!Iq(this.Ut)};S.prototype.GetCollideConnected=function(){return !!Jq(this.Ut)};S.prototype.__destroy__=function(){Kq(this.Ut);};function Vw(){throw "cannot construct a b2PulleyJoint, no constructor in IDL";}Vw.prototype=Object.create(k.prototype);Vw.prototype.constructor=Vw;Vw.prototype.Vt=Vw;Vw.Wt={};a.b2PulleyJoint=Vw;
Vw.prototype.GetGroundAnchorA=function(){return h(Lq(this.Ut),m)};Vw.prototype.GetGroundAnchorB=function(){return h(Mq(this.Ut),m)};Vw.prototype.GetLengthA=function(){return Nq(this.Ut)};Vw.prototype.GetLengthB=function(){return Oq(this.Ut)};Vw.prototype.GetRatio=function(){return Pq(this.Ut)};Vw.prototype.GetCurrentLengthA=function(){return Qq(this.Ut)};Vw.prototype.GetCurrentLengthB=function(){return Rq(this.Ut)};Vw.prototype.GetType=function(){return Sq(this.Ut)};
Vw.prototype.GetBodyA=function(){return h(Tq(this.Ut),l)};Vw.prototype.GetBodyB=function(){return h(Uq(this.Ut),l)};Vw.prototype.GetAnchorA=function(){return h(Vq(this.Ut),m)};Vw.prototype.GetAnchorB=function(){return h(Wq(this.Ut),m)};Vw.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Xq(c,b),m)};Vw.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return Yq(c,b)};
Vw.prototype.GetNext=function(){return h(Zq(this.Ut),k)};Vw.prototype.GetUserData=function(){return $q(this.Ut)};Vw.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ar(c,b);};Vw.prototype.IsActive=function(){return !!br(this.Ut)};Vw.prototype.GetCollideConnected=function(){return !!cr(this.Ut)};Vw.prototype.__destroy__=function(){dr(this.Ut);};function T(){this.Ut=er();g(T)[this.Ut]=this;}T.prototype=Object.create(n.prototype);T.prototype.constructor=T;T.prototype.Vt=T;
T.Wt={};a.b2MouseJointDef=T;T.prototype.get_target=T.prototype.Mw=function(){return h(fr(this.Ut),m)};T.prototype.set_target=T.prototype.zy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);gr(c,b);};Object.defineProperty(T.prototype,"target",{get:T.prototype.Mw,set:T.prototype.zy});T.prototype.get_maxForce=T.prototype.tu=function(){return hr(this.Ut)};T.prototype.set_maxForce=T.prototype.xu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ir(c,b);};
Object.defineProperty(T.prototype,"maxForce",{get:T.prototype.tu,set:T.prototype.xu});T.prototype.get_frequencyHz=T.prototype.pu=function(){return jr(this.Ut)};T.prototype.set_frequencyHz=T.prototype.ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kr(c,b);};Object.defineProperty(T.prototype,"frequencyHz",{get:T.prototype.pu,set:T.prototype.ru});T.prototype.get_dampingRatio=T.prototype.ou=function(){return lr(this.Ut)};
T.prototype.set_dampingRatio=T.prototype.qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mr(c,b);};Object.defineProperty(T.prototype,"dampingRatio",{get:T.prototype.ou,set:T.prototype.qu});T.prototype.get_type=T.prototype.Xt=function(){return nr(this.Ut)};T.prototype.set_type=T.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);or(c,b);};Object.defineProperty(T.prototype,"type",{get:T.prototype.Xt,set:T.prototype.Zt});T.prototype.get_userData=T.prototype.Yt=function(){return pr(this.Ut)};
T.prototype.set_userData=T.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qr(c,b);};Object.defineProperty(T.prototype,"userData",{get:T.prototype.Yt,set:T.prototype.$t});T.prototype.get_bodyA=T.prototype.au=function(){return h(rr(this.Ut),l)};T.prototype.set_bodyA=T.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);sr(c,b);};Object.defineProperty(T.prototype,"bodyA",{get:T.prototype.au,set:T.prototype.du});
T.prototype.get_bodyB=T.prototype.bu=function(){return h(tr(this.Ut),l)};T.prototype.set_bodyB=T.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ur(c,b);};Object.defineProperty(T.prototype,"bodyB",{get:T.prototype.bu,set:T.prototype.eu});T.prototype.get_collideConnected=T.prototype.cu=function(){return !!vr(this.Ut)};T.prototype.set_collideConnected=T.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wr(c,b);};
Object.defineProperty(T.prototype,"collideConnected",{get:T.prototype.cu,set:T.prototype.fu});T.prototype.__destroy__=function(){xr(this.Ut);};function Iw(){throw "cannot construct a b2Contact, no constructor in IDL";}Iw.prototype=Object.create(e.prototype);Iw.prototype.constructor=Iw;Iw.prototype.Vt=Iw;Iw.Wt={};a.b2Contact=Iw;Iw.prototype.GetManifold=function(){return h(yr(this.Ut),C)};Iw.prototype.GetWorldManifold=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);zr(c,b);};
Iw.prototype.IsTouching=function(){return !!Ar(this.Ut)};Iw.prototype.SetEnabled=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Br(c,b);};Iw.prototype.IsEnabled=function(){return !!Cr(this.Ut)};Iw.prototype.GetNext=function(){return h(Dr(this.Ut),Iw)};Iw.prototype.GetFixtureA=function(){return h(Er(this.Ut),t)};Iw.prototype.GetChildIndexA=function(){return Fr(this.Ut)};Iw.prototype.GetFixtureB=function(){return h(Gr(this.Ut),t)};Iw.prototype.GetChildIndexB=function(){return Hr(this.Ut)};
Iw.prototype.SetFriction=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ir(c,b);};Iw.prototype.GetFriction=function(){return Jr(this.Ut)};Iw.prototype.ResetFriction=function(){Kr(this.Ut);};Iw.prototype.SetRestitution=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Lr(c,b);};Iw.prototype.GetRestitution=function(){return Mr(this.Ut)};Iw.prototype.ResetRestitution=function(){Nr(this.Ut);};
Iw.prototype.SetTangentSpeed=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Or(c,b);};Iw.prototype.GetTangentSpeed=function(){return Pr(this.Ut)};function U(){this.Ut=Qr();g(U)[this.Ut]=this;}U.prototype=Object.create(n.prototype);U.prototype.constructor=U;U.prototype.Vt=U;U.Wt={};a.b2DistanceJointDef=U;
U.prototype.Initialize=function(b,c,d,f){var y=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);f&&"object"===typeof f&&(f=f.Ut);Rr(y,b,c,d,f);};U.prototype.get_localAnchorA=U.prototype.gu=function(){return h(Sr(this.Ut),m)};U.prototype.set_localAnchorA=U.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Tr(c,b);};Object.defineProperty(U.prototype,"localAnchorA",{get:U.prototype.gu,set:U.prototype.iu});
U.prototype.get_localAnchorB=U.prototype.hu=function(){return h(Ur(this.Ut),m)};U.prototype.set_localAnchorB=U.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vr(c,b);};Object.defineProperty(U.prototype,"localAnchorB",{get:U.prototype.hu,set:U.prototype.ju});U.prototype.get_length=U.prototype.Rv=function(){return Wr(this.Ut)};U.prototype.set_length=U.prototype.Ex=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xr(c,b);};
Object.defineProperty(U.prototype,"length",{get:U.prototype.Rv,set:U.prototype.Ex});U.prototype.get_frequencyHz=U.prototype.pu=function(){return Yr(this.Ut)};U.prototype.set_frequencyHz=U.prototype.ru=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zr(c,b);};Object.defineProperty(U.prototype,"frequencyHz",{get:U.prototype.pu,set:U.prototype.ru});U.prototype.get_dampingRatio=U.prototype.ou=function(){return $r(this.Ut)};
U.prototype.set_dampingRatio=U.prototype.qu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);as(c,b);};Object.defineProperty(U.prototype,"dampingRatio",{get:U.prototype.ou,set:U.prototype.qu});U.prototype.get_type=U.prototype.Xt=function(){return bs(this.Ut)};U.prototype.set_type=U.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);cs(c,b);};Object.defineProperty(U.prototype,"type",{get:U.prototype.Xt,set:U.prototype.Zt});U.prototype.get_userData=U.prototype.Yt=function(){return ds(this.Ut)};
U.prototype.set_userData=U.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);es(c,b);};Object.defineProperty(U.prototype,"userData",{get:U.prototype.Yt,set:U.prototype.$t});U.prototype.get_bodyA=U.prototype.au=function(){return h(gs(this.Ut),l)};U.prototype.set_bodyA=U.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);hs(c,b);};Object.defineProperty(U.prototype,"bodyA",{get:U.prototype.au,set:U.prototype.du});
U.prototype.get_bodyB=U.prototype.bu=function(){return h(is(this.Ut),l)};U.prototype.set_bodyB=U.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);js(c,b);};Object.defineProperty(U.prototype,"bodyB",{get:U.prototype.bu,set:U.prototype.eu});U.prototype.get_collideConnected=U.prototype.cu=function(){return !!ks(this.Ut)};U.prototype.set_collideConnected=U.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ls(c,b);};
Object.defineProperty(U.prototype,"collideConnected",{get:U.prototype.cu,set:U.prototype.fu});U.prototype.__destroy__=function(){ms(this.Ut);};function l(){throw "cannot construct a b2Body, no constructor in IDL";}l.prototype=Object.create(e.prototype);l.prototype.constructor=l;l.prototype.Vt=l;l.Wt={};a.b2Body=l;l.prototype.CreateFixture=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);return void 0===c?h(ns(d,b),t):h(ps(d,b,c),t)};
l.prototype.DestroyFixture=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qs(c,b);};l.prototype.SetTransform=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);rs(d,b,c);};l.prototype.GetTransform=function(){return h(ss(this.Ut),Qw)};l.prototype.GetPosition=function(){return h(ts(this.Ut),m)};l.prototype.GetAngle=function(){return us(this.Ut)};l.prototype.GetWorldCenter=function(){return h(vs(this.Ut),m)};
l.prototype.GetLocalCenter=function(){return h(xs(this.Ut),m)};l.prototype.SetLinearVelocity=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ys(c,b);};l.prototype.GetLinearVelocity=function(){return h(zs(this.Ut),m)};l.prototype.SetAngularVelocity=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);As(c,b);};l.prototype.GetAngularVelocity=function(){return Bs(this.Ut)};
l.prototype.ApplyForce=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Cs(f,b,c,d);};l.prototype.ApplyForceToCenter=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Ds(d,b,c);};l.prototype.ApplyTorque=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Es(d,b,c);};
l.prototype.ApplyLinearImpulse=function(b,c,d){var f=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);d&&"object"===typeof d&&(d=d.Ut);Fs(f,b,c,d);};l.prototype.ApplyAngularImpulse=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);Gs(d,b,c);};l.prototype.GetMass=function(){return Hs(this.Ut)};l.prototype.GetInertia=function(){return Is(this.Ut)};
l.prototype.GetMassData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Js(c,b);};l.prototype.SetMassData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ks(c,b);};l.prototype.ResetMassData=function(){Ls(this.Ut);};l.prototype.GetWorldPoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Ms(c,b),m)};l.prototype.GetWorldVector=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Ns(c,b),m)};
l.prototype.GetLocalPoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Os(c,b),m)};l.prototype.GetLocalVector=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Ps(c,b),m)};l.prototype.GetLinearVelocityFromWorldPoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Qs(c,b),m)};l.prototype.GetLinearVelocityFromLocalPoint=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Rs(c,b),m)};l.prototype.GetLinearDamping=function(){return Ss(this.Ut)};
l.prototype.SetLinearDamping=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ts(c,b);};l.prototype.GetAngularDamping=function(){return Us(this.Ut)};l.prototype.SetAngularDamping=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vs(c,b);};l.prototype.GetGravityScale=function(){return Ws(this.Ut)};l.prototype.SetGravityScale=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xs(c,b);};l.prototype.SetType=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ys(c,b);};
l.prototype.GetType=function(){return Zs(this.Ut)};l.prototype.SetBullet=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);$s(c,b);};l.prototype.IsBullet=function(){return !!at(this.Ut)};l.prototype.SetSleepingAllowed=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bt(c,b);};l.prototype.IsSleepingAllowed=function(){return !!ct(this.Ut)};l.prototype.SetAwake=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dt(c,b);};l.prototype.IsAwake=function(){return !!et(this.Ut)};
l.prototype.SetActive=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ft(c,b);};l.prototype.IsActive=function(){return !!gt(this.Ut)};l.prototype.SetFixedRotation=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ht(c,b);};l.prototype.IsFixedRotation=function(){return !!it(this.Ut)};l.prototype.GetFixtureList=function(){return h(jt(this.Ut),t)};l.prototype.GetJointList=function(){return h(kt(this.Ut),K)};l.prototype.GetContactList=function(){return h(lt(this.Ut),V)};
l.prototype.GetNext=function(){return h(mt(this.Ut),l)};l.prototype.GetUserData=function(){return nt(this.Ut)};l.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ot(c,b);};l.prototype.GetWorld=function(){return h(pt(this.Ut),F)};l.prototype.Dump=function(){qt(this.Ut);};function Ww(){throw "cannot construct a b2FrictionJoint, no constructor in IDL";}Ww.prototype=Object.create(k.prototype);Ww.prototype.constructor=Ww;Ww.prototype.Vt=Ww;Ww.Wt={};a.b2FrictionJoint=Ww;
Ww.prototype.GetLocalAnchorA=function(){return h(rt(this.Ut),m)};Ww.prototype.GetLocalAnchorB=function(){return h(st(this.Ut),m)};Ww.prototype.SetMaxForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);tt(c,b);};Ww.prototype.GetMaxForce=function(){return ut(this.Ut)};Ww.prototype.SetMaxTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);vt(c,b);};Ww.prototype.GetMaxTorque=function(){return wt(this.Ut)};Ww.prototype.GetType=function(){return xt(this.Ut)};
Ww.prototype.GetBodyA=function(){return h(yt(this.Ut),l)};Ww.prototype.GetBodyB=function(){return h(zt(this.Ut),l)};Ww.prototype.GetAnchorA=function(){return h(At(this.Ut),m)};Ww.prototype.GetAnchorB=function(){return h(Bt(this.Ut),m)};Ww.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(Ct(c,b),m)};Ww.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return Dt(c,b)};
Ww.prototype.GetNext=function(){return h(Et(this.Ut),k)};Ww.prototype.GetUserData=function(){return Ft(this.Ut)};Ww.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Gt(c,b);};Ww.prototype.IsActive=function(){return !!Ht(this.Ut)};Ww.prototype.GetCollideConnected=function(){return !!It(this.Ut)};Ww.prototype.__destroy__=function(){Jt(this.Ut);};function Xw(){throw "cannot construct a b2DestructionListener, no constructor in IDL";}Xw.prototype=Object.create(e.prototype);
Xw.prototype.constructor=Xw;Xw.prototype.Vt=Xw;Xw.Wt={};a.b2DestructionListener=Xw;Xw.prototype.__destroy__=function(){Kt(this.Ut);};function W(){this.Ut=Lt();g(W)[this.Ut]=this;}W.prototype=Object.create(n.prototype);W.prototype.constructor=W;W.prototype.Vt=W;W.Wt={};a.b2GearJointDef=W;W.prototype.get_joint1=W.prototype.Ov=function(){return h(Mt(this.Ut),k)};W.prototype.set_joint1=W.prototype.Bx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Nt(c,b);};
Object.defineProperty(W.prototype,"joint1",{get:W.prototype.Ov,set:W.prototype.Bx});W.prototype.get_joint2=W.prototype.Pv=function(){return h(Ot(this.Ut),k)};W.prototype.set_joint2=W.prototype.Cx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Pt(c,b);};Object.defineProperty(W.prototype,"joint2",{get:W.prototype.Pv,set:W.prototype.Cx});W.prototype.get_ratio=W.prototype.Nu=function(){return Qt(this.Ut)};
W.prototype.set_ratio=W.prototype.bv=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Rt(c,b);};Object.defineProperty(W.prototype,"ratio",{get:W.prototype.Nu,set:W.prototype.bv});W.prototype.get_type=W.prototype.Xt=function(){return St(this.Ut)};W.prototype.set_type=W.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Tt(c,b);};Object.defineProperty(W.prototype,"type",{get:W.prototype.Xt,set:W.prototype.Zt});W.prototype.get_userData=W.prototype.Yt=function(){return Ut(this.Ut)};
W.prototype.set_userData=W.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Vt(c,b);};Object.defineProperty(W.prototype,"userData",{get:W.prototype.Yt,set:W.prototype.$t});W.prototype.get_bodyA=W.prototype.au=function(){return h(Wt(this.Ut),l)};W.prototype.set_bodyA=W.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Xt(c,b);};Object.defineProperty(W.prototype,"bodyA",{get:W.prototype.au,set:W.prototype.du});
W.prototype.get_bodyB=W.prototype.bu=function(){return h(Yt(this.Ut),l)};W.prototype.set_bodyB=W.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Zt(c,b);};Object.defineProperty(W.prototype,"bodyB",{get:W.prototype.bu,set:W.prototype.eu});W.prototype.get_collideConnected=W.prototype.cu=function(){return !!$t(this.Ut)};W.prototype.set_collideConnected=W.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);au(c,b);};
Object.defineProperty(W.prototype,"collideConnected",{get:W.prototype.cu,set:W.prototype.fu});W.prototype.__destroy__=function(){bu(this.Ut);};function X(){throw "cannot construct a b2RevoluteJoint, no constructor in IDL";}X.prototype=Object.create(k.prototype);X.prototype.constructor=X;X.prototype.Vt=X;X.Wt={};a.b2RevoluteJoint=X;X.prototype.GetLocalAnchorA=function(){return h(cu(this.Ut),m)};X.prototype.GetLocalAnchorB=function(){return h(du(this.Ut),m)};X.prototype.GetReferenceAngle=function(){return eu(this.Ut)};
X.prototype.GetJointAngle=function(){return fu(this.Ut)};X.prototype.GetJointSpeed=function(){return gu(this.Ut)};X.prototype.IsLimitEnabled=function(){return !!hu(this.Ut)};X.prototype.EnableLimit=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);iu(c,b);};X.prototype.GetLowerLimit=function(){return ju(this.Ut)};X.prototype.GetUpperLimit=function(){return ku(this.Ut)};
X.prototype.SetLimits=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);lu(d,b,c);};X.prototype.IsMotorEnabled=function(){return !!mu(this.Ut)};X.prototype.EnableMotor=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);nu(c,b);};X.prototype.SetMotorSpeed=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ou(c,b);};X.prototype.GetMotorSpeed=function(){return pu(this.Ut)};
X.prototype.SetMaxMotorTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qu(c,b);};X.prototype.GetMaxMotorTorque=function(){return ru(this.Ut)};X.prototype.GetMotorTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return su(c,b)};X.prototype.GetType=function(){return tu(this.Ut)};X.prototype.GetBodyA=function(){return h(uu(this.Ut),l)};X.prototype.GetBodyB=function(){return h(vu(this.Ut),l)};X.prototype.GetAnchorA=function(){return h(wu(this.Ut),m)};
X.prototype.GetAnchorB=function(){return h(xu(this.Ut),m)};X.prototype.GetReactionForce=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return h(yu(c,b),m)};X.prototype.GetReactionTorque=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);return zu(c,b)};X.prototype.GetNext=function(){return h(Au(this.Ut),k)};X.prototype.GetUserData=function(){return Bu(this.Ut)};X.prototype.SetUserData=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Cu(c,b);};X.prototype.IsActive=function(){return !!Du(this.Ut)};
X.prototype.GetCollideConnected=function(){return !!Eu(this.Ut)};X.prototype.__destroy__=function(){Fu(this.Ut);};function V(){this.Ut=Gu();g(V)[this.Ut]=this;}V.prototype=Object.create(e.prototype);V.prototype.constructor=V;V.prototype.Vt=V;V.Wt={};a.b2ContactEdge=V;V.prototype.get_other=V.prototype.Lu=function(){return h(Hu(this.Ut),l)};V.prototype.set_other=V.prototype.$u=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Iu(c,b);};
Object.defineProperty(V.prototype,"other",{get:V.prototype.Lu,set:V.prototype.$u});V.prototype.get_contact=V.prototype.vv=function(){return h(Ju(this.Ut),Iw)};V.prototype.set_contact=V.prototype.ix=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ku(c,b);};Object.defineProperty(V.prototype,"contact",{get:V.prototype.vv,set:V.prototype.ix});V.prototype.get_prev=V.prototype.Mu=function(){return h(Lu(this.Ut),V)};
V.prototype.set_prev=V.prototype.av=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Mu(c,b);};Object.defineProperty(V.prototype,"prev",{get:V.prototype.Mu,set:V.prototype.av});V.prototype.get_next=V.prototype.Ju=function(){return h(Nu(this.Ut),V)};V.prototype.set_next=V.prototype.Yu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Ou(c,b);};Object.defineProperty(V.prototype,"next",{get:V.prototype.Ju,set:V.prototype.Yu});V.prototype.__destroy__=function(){Pu(this.Ut);};
function Y(){this.Ut=Qu();g(Y)[this.Ut]=this;}Y.prototype=Object.create(n.prototype);Y.prototype.constructor=Y;Y.prototype.Vt=Y;Y.Wt={};a.b2RopeJointDef=Y;Y.prototype.get_localAnchorA=Y.prototype.gu=function(){return h(Ru(this.Ut),m)};Y.prototype.set_localAnchorA=Y.prototype.iu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Su(c,b);};Object.defineProperty(Y.prototype,"localAnchorA",{get:Y.prototype.gu,set:Y.prototype.iu});
Y.prototype.get_localAnchorB=Y.prototype.hu=function(){return h(Tu(this.Ut),m)};Y.prototype.set_localAnchorB=Y.prototype.ju=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Uu(c,b);};Object.defineProperty(Y.prototype,"localAnchorB",{get:Y.prototype.hu,set:Y.prototype.ju});Y.prototype.get_maxLength=Y.prototype.qw=function(){return Vu(this.Ut)};Y.prototype.set_maxLength=Y.prototype.dy=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Wu(c,b);};
Object.defineProperty(Y.prototype,"maxLength",{get:Y.prototype.qw,set:Y.prototype.dy});Y.prototype.get_type=Y.prototype.Xt=function(){return Xu(this.Ut)};Y.prototype.set_type=Y.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Yu(c,b);};Object.defineProperty(Y.prototype,"type",{get:Y.prototype.Xt,set:Y.prototype.Zt});Y.prototype.get_userData=Y.prototype.Yt=function(){return Zu(this.Ut)};
Y.prototype.set_userData=Y.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);$u(c,b);};Object.defineProperty(Y.prototype,"userData",{get:Y.prototype.Yt,set:Y.prototype.$t});Y.prototype.get_bodyA=Y.prototype.au=function(){return h(av(this.Ut),l)};Y.prototype.set_bodyA=Y.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);bv(c,b);};Object.defineProperty(Y.prototype,"bodyA",{get:Y.prototype.au,set:Y.prototype.du});
Y.prototype.get_bodyB=Y.prototype.bu=function(){return h(cv(this.Ut),l)};Y.prototype.set_bodyB=Y.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);dv(c,b);};Object.defineProperty(Y.prototype,"bodyB",{get:Y.prototype.bu,set:Y.prototype.eu});Y.prototype.get_collideConnected=Y.prototype.cu=function(){return !!ev(this.Ut)};Y.prototype.set_collideConnected=Y.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);fv(c,b);};
Object.defineProperty(Y.prototype,"collideConnected",{get:Y.prototype.cu,set:Y.prototype.fu});Y.prototype.__destroy__=function(){gv(this.Ut);};function Z(){this.Ut=hv();g(Z)[this.Ut]=this;}Z.prototype=Object.create(n.prototype);Z.prototype.constructor=Z;Z.prototype.Vt=Z;Z.Wt={};a.b2MotorJointDef=Z;Z.prototype.Initialize=function(b,c){var d=this.Ut;b&&"object"===typeof b&&(b=b.Ut);c&&"object"===typeof c&&(c=c.Ut);iv(d,b,c);};
Z.prototype.get_linearOffset=Z.prototype.Vv=function(){return h(jv(this.Ut),m)};Z.prototype.set_linearOffset=Z.prototype.Ix=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);kv(c,b);};Object.defineProperty(Z.prototype,"linearOffset",{get:Z.prototype.Vv,set:Z.prototype.Ix});Z.prototype.get_angularOffset=Z.prototype.kv=function(){return lv(this.Ut)};Z.prototype.set_angularOffset=Z.prototype.Yw=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);mv(c,b);};
Object.defineProperty(Z.prototype,"angularOffset",{get:Z.prototype.kv,set:Z.prototype.Yw});Z.prototype.get_maxForce=Z.prototype.tu=function(){return nv(this.Ut)};Z.prototype.set_maxForce=Z.prototype.xu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);ov(c,b);};Object.defineProperty(Z.prototype,"maxForce",{get:Z.prototype.tu,set:Z.prototype.xu});Z.prototype.get_maxTorque=Z.prototype.Iu=function(){return pv(this.Ut)};
Z.prototype.set_maxTorque=Z.prototype.Xu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);qv(c,b);};Object.defineProperty(Z.prototype,"maxTorque",{get:Z.prototype.Iu,set:Z.prototype.Xu});Z.prototype.get_correctionFactor=Z.prototype.wv=function(){return rv(this.Ut)};Z.prototype.set_correctionFactor=Z.prototype.jx=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);sv(c,b);};Object.defineProperty(Z.prototype,"correctionFactor",{get:Z.prototype.wv,set:Z.prototype.jx});
Z.prototype.get_type=Z.prototype.Xt=function(){return tv(this.Ut)};Z.prototype.set_type=Z.prototype.Zt=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);uv(c,b);};Object.defineProperty(Z.prototype,"type",{get:Z.prototype.Xt,set:Z.prototype.Zt});Z.prototype.get_userData=Z.prototype.Yt=function(){return vv(this.Ut)};Z.prototype.set_userData=Z.prototype.$t=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);wv(c,b);};Object.defineProperty(Z.prototype,"userData",{get:Z.prototype.Yt,set:Z.prototype.$t});
Z.prototype.get_bodyA=Z.prototype.au=function(){return h(xv(this.Ut),l)};Z.prototype.set_bodyA=Z.prototype.du=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);yv(c,b);};Object.defineProperty(Z.prototype,"bodyA",{get:Z.prototype.au,set:Z.prototype.du});Z.prototype.get_bodyB=Z.prototype.bu=function(){return h(zv(this.Ut),l)};Z.prototype.set_bodyB=Z.prototype.eu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Av(c,b);};
Object.defineProperty(Z.prototype,"bodyB",{get:Z.prototype.bu,set:Z.prototype.eu});Z.prototype.get_collideConnected=Z.prototype.cu=function(){return !!Bv(this.Ut)};Z.prototype.set_collideConnected=Z.prototype.fu=function(b){var c=this.Ut;b&&"object"===typeof b&&(b=b.Ut);Cv(c,b);};Object.defineProperty(Z.prototype,"collideConnected",{get:Z.prototype.cu,set:Z.prototype.fu});Z.prototype.__destroy__=function(){Dv(this.Ut);};
(function(){function b(){a.b2Shape.e_circle=Ev();a.b2Shape.e_edge=Fv();a.b2Shape.e_polygon=Gv();a.b2Shape.e_chain=Hv();a.b2Shape.e_typeCount=Iv();a.e_unknownJoint=Jv();a.e_revoluteJoint=Kv();a.e_prismaticJoint=Lv();a.e_distanceJoint=Mv();a.e_pulleyJoint=Nv();a.e_mouseJoint=Ov();a.e_gearJoint=Pv();a.e_wheelJoint=Qv();a.e_weldJoint=Rv();a.e_frictionJoint=Sv();a.e_ropeJoint=Tv();a.e_motorJoint=Uv();a.e_inactiveLimit=Vv();a.e_atLowerLimit=Wv();a.e_atUpperLimit=Xv();a.e_equalLimits=Yv();a.b2Manifold.e_circles=
Zv();a.b2Manifold.e_faceA=$v();a.b2Manifold.e_faceB=aw();a.b2_staticBody=bw();a.b2_kinematicBody=cw();a.b2_dynamicBody=dw();a.b2Draw.e_shapeBit=ew();a.b2Draw.e_jointBit=fw();a.b2Draw.e_aabbBit=gw();a.b2Draw.e_pairBit=hw();a.b2Draw.e_centerOfMassBit=iw();a.b2ContactFeature.e_vertex=jw();a.b2ContactFeature.e_face=kw();}Ka?b():Ia.unshift(b);})();


  return Box2D.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Box2D$1;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return Box2D$1; });
    else if (typeof exports === 'object')
      exports["Box2D"] = Box2D$1;

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const canvas = document.body.querySelector("canvas");
const ctx = canvas.getContext("2d", { desynchronized: true });
const screen = {
    width: 0,
    height: 0,
    dpr: 1,
};
function handleResize() {
    screen.dpr = devicePixelRatio;
    screen.width = document.body.clientWidth * screen.dpr;
    screen.height = document.body.clientHeight * screen.dpr;
    if (canvas.width == screen.width && canvas.height == screen.height) {
        return;
    }
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvas.style.width = document.body.clientWidth + "px";
    canvas.style.height = document.body.clientHeight + "px";
}
handleResize();

const camera = {
    x: 0,
    y: 0,
    scale: 150,
    m: create$7(),
};
function screenToWorld(p) {
    const [x, y] = p;
    return fromValues((x - ctx.canvas.width / 2) / camera.scale + camera.x, (y - ctx.canvas.height / 2) / camera.scale + camera.y);
}
const focusPoint = create();
const SCREEN_HEIGHT_IN_METERS = 6;
function setupCamera() {
    camera.scale = Math.max(0.01, screen.height / SCREEN_HEIGHT_IN_METERS);
    const SCREEN_WIDTH_IN_METERS = screen.width / camera.scale;
    camera.x = focusPoint[0] + SCREEN_WIDTH_IN_METERS * 0.25;
    camera.y = focusPoint[1] - SCREEN_HEIGHT_IN_METERS * 0;
    identity$4(camera.m);
    translate$3(camera.m, camera.m, fromValues(ctx.canvas.width / 2, ctx.canvas.height / 2));
    scale$7(camera.m, camera.m, fromValues(camera.scale, camera.scale));
    translate$3(camera.m, camera.m, fromValues(-camera.x, -camera.y));
}
function setFocusPoint(x, y) {
    set(focusPoint, x, y);
    setupCamera();
}

const keys = new Map();
const mouse = create();
document.body.onkeydown = e => {
    const info = keys.get(e.code);
    if (!info) {
        keys.set(e.code, {
            down_timestamp: e.timeStamp,
        });
    }
    else {
        // don't override initial timepstamp
        if (info.up_timestamp === undefined) {
            return;
        }
        info.down_timestamp = e.timeStamp;
        delete info.up_timestamp;
        delete info.used;
    }
};
document.body.onkeyup = e => {
    const info = keys.get(e.code);
    if (!info) {
        return;
    }
    info.up_timestamp = e.timeStamp;
};
ctx.canvas.onmousemove = e => {
    set(mouse, e.clientX * screen.dpr, e.clientY * screen.dpr);
};
function markPressAsUsed(key) {
    const info = keys.get(key);
    if (info) {
        info.used = true;
    }
}
function isPressed(key) {
    const info = keys.get(key);
    return info && !info.used && info.up_timestamp == undefined;
}
function getPressedDuration(key) {
    const info = keys.get(key);
    if (!info || info.used) {
        return undefined;
    }
    const up_timestamp = info.up_timestamp || now();
    return up_timestamp - info.down_timestamp;
}
function getEllapsedSincePressStart(key) {
    const info = keys.get(key);
    if (!info || info.used) {
        return undefined;
    }
    return now() - info.down_timestamp;
}

let player;
const MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME = 100;
const JUMP_MAX_TIME = 200;
function playerControls() {
    let dstVelocity;
    if (isPressed("KeyD")) {
        player.isMoving = true;
        player.obj.mirror = false;
        dstVelocity = MAX_SPEED_ON_FOOT;
    }
    else if (isPressed("KeyA")) {
        player.isMoving = true;
        player.obj.mirror = true;
        dstVelocity = -MAX_SPEED_ON_FOOT;
    }
    else {
        player.isMoving = false;
        dstVelocity = 0;
    }
    let velocityMul;
    const dstDirection = Math.sign(dstVelocity);
    if (dstDirection === -player.movingDirection) {
        velocityMul = -1;
    }
    else if (dstDirection === 0) {
        velocityMul = 0;
    }
    else {
        velocityMul = 1;
    }
    player.changeSpeed(dstVelocity, velocityMul);
    if (player.touchingGround) {
        const spacePressed = isPressed("Space");
        if (spacePressed) {
            player.startJump();
        }
        const spacePressedDuration = getPressedDuration("Space");
        if (spacePressedDuration !== undefined) {
            if (!spacePressed || spacePressedDuration >= JUMP_MAX_TIME) {
                const jumpPower = Math.min(spacePressedDuration / JUMP_MAX_TIME, 1);
                if (jumpPower > 0.0) {
                    player.jump(jumpPower);
                }
                else {
                    player.cancelJump();
                }
                markPressAsUsed("Space");
            }
        }
    }
    else {
        const ellapsedSincePressStart = getEllapsedSincePressStart("Space");
        if (ellapsedSincePressStart !== undefined &&
            ellapsedSincePressStart > MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME) {
            markPressAsUsed("Space");
        }
    }
}
function playerControlsPostPhysics() {
    setFocusPoint(player.obj.x, player.obj.y);
    const mouseWorldSpace = screenToWorld(mouse);
    player.aimAt(mouseWorldSpace);
}
function createPlayer() {
    player = new Character("player", true);
    player.onBeforePhysics = playerControls;
    player.onAfterPhysics = playerControlsPostPhysics;
}

const scene = [];
const objectsToDraw = [];
const objectsByID = new Map();
function drawObj(obj) {
    obj.worldZ = getParentWorldZ(obj) + obj.z;
    const worldMat = obj.calcWorldMatrix();
    if (obj.graphics) {
        // pixel to units
        const unitMatrix = obj.graphics.unitMatrix;
        mul$7(obj.mvpMatrix, camera.m, worldMat);
        mul$7(obj.mvpMatrix, obj.mvpMatrix, unitMatrix);
        const time = now() - obj.startTime;
        const index = obj.graphics.timeToIndex(time);
        obj.lastIndex = index;
        const points = obj.graphics.getPoints(index);
        if (points) {
            if (!obj.parent) {
                throw new Error("Attachment without a parent.");
            }
            for (const pointName in points) {
                obj.parent.setPoint(pointName, points[pointName], obj);
            }
        }
        objectsToDraw.push(obj);
    }
    for (const slot in obj.attachments) {
        drawObj(obj.attachments[slot]);
    }
}
function syncPhysics() {
    for (const obj of scene) {
        syncObjWithPhysics(obj);
    }
}
function drawScene() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    objectsToDraw.length = 0;
    for (const obj of scene) {
        drawObj(obj);
    }
    objectsToDraw.sort((a, b) => a.worldZ - b.worldZ);
    for (const obj of objectsToDraw) {
        const { mvpMatrix, lastIndex } = obj;
        const type = obj.graphics.type;
        if (type !== GraphicsType.NONE && lastIndex !== undefined) {
            ctx.setTransform(mvpMatrix[0], mvpMatrix[1], mvpMatrix[2], mvpMatrix[3], mvpMatrix[4], mvpMatrix[5]);
            switch (type) {
                case GraphicsType.IMG: {
                    const img = obj.graphics.getFrame(lastIndex);
                    ctx.drawImage(img, 0, 0);
                    break;
                }
                case GraphicsType.LINE: {
                    const path = obj.graphics.getPath(lastIndex);
                    ctx.globalAlpha = obj.graphics.alpha;
                    ctx.lineWidth = 1;
                    if (obj.graphics.stroke) {
                        ctx.strokeStyle = obj.graphics.color;
                        ctx.stroke(path);
                    }
                    else {
                        ctx.fillStyle = obj.graphics.color;
                        ctx.fill(path);
                    }
                    ctx.globalAlpha = 1;
                    break;
                }
            }
        }
    }
    for (const obj of scene) {
        for (const [pointName] of obj.points) {
            if (pointName === "") {
                for (const t of [0, 1]) {
                    const attachmentInfo = getAttachmentInfo(obj, pointName, t);
                    if (!attachmentInfo) {
                        continue;
                    }
                    const { m: attachmentMatrix, parentObj } = attachmentInfo;
                    const m = create$7();
                    mul$7(m, camera.m, parentObj.getWorldMatrix());
                    mul$7(m, m, attachmentMatrix);
                    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    ctx.arc(0, 0, 0.03, 0, 9);
                    ctx.fill();
                }
            }
        }
    }
    // DEBUG DRAW
    ctx.resetTransform();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(mouse[0], mouse[1], 5, 0, 9);
    ctx.fill();
    // DEBUG PHYSICS DRAW
    function drawCollisionModel(obj) {
        if (obj.graphics.physicsType === PhysicsType.NONE) {
            return;
        }
        const physicsPoints = obj.graphics.physicsPoints;
        const scale$1 = getWorldScale(obj);
        const { mvpMatrix } = obj;
        ctx.setTransform(mvpMatrix[0], mvpMatrix[1], mvpMatrix[2], mvpMatrix[3], mvpMatrix[4], mvpMatrix[5]);
        const lineWidth = fromValues(0.01, 0);
        transformMat2d(lineWidth, lineWidth, obj.graphics.invUnitMatrix);
        scale(lineWidth, lineWidth, 1 / scale$1);
        ctx.strokeStyle = "deeppink";
        ctx.lineWidth = lineWidth[0];
        ctx.beginPath();
        for (let i = 0; i < physicsPoints.length; i++) {
            const p = fromValues(physicsPoints[i][0], physicsPoints[i][1]);
            if (obj.graphics.physicsPivot) {
                add(p, p, obj.graphics.physicsPivot);
            }
            transformMat2d(p, p, obj.graphics.invUnitMatrix);
            if (i === 0) {
                ctx.moveTo(p[0], p[1]);
            }
            else {
                ctx.lineTo(p[0], p[1]);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    for (const obj of objectsToDraw) {
        /*
        if (obj.graphics.name !== "dummy") {
            continue
        }
        */
        drawCollisionModel(obj);
        for (const slot in obj.attachments) {
            drawCollisionModel(obj.attachments[slot]);
        }
    }
    /*
    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5])
    ctx.fillStyle = "rgb(0, 255, 0)"
    const p = debugPoint
    ctx.beginPath()
    ctx.arc(p[0], p[1], 0.01, 0, 9)
    ctx.fill()
    */
    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5]);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 0.01;
    ctx.beginPath();
    const footY = player.obj.y - FOOT_HEIGHT * player.obj.scale;
    ctx.moveTo(player.obj.x, footY - FOOT_START * player.obj.scale);
    ctx.lineTo(player.obj.x, footY + FOOT_FULL_HEIGHT * player.obj.scale);
    ctx.stroke();
    // DEBUG JUMP VISULIZATION
    const p = 1;
    const xh = 2.5 * p; // horizontal distance for jump
    const h = -2.2 * p; // height for jump
    const vx = getVelocityX(player.obj.body); // horizontal speed
    if (player.touchingGround) {
        const a_vx = Math.abs(vx);
    }
}
function addToScene(obj) {
    scene.push(obj);
    objectsByID.set(obj.id, obj);
    for (const slot in obj.attachments) {
        const attachment = obj.attachments[slot];
        objectsByID.set(attachment.id, attachment);
    }
    addToPhysics(obj);
}
function getObjectByID(id) {
    const obj = objectsByID.get(id);
    if (!obj) {
        throw new Error("Can't find object by id");
    }
    return obj;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let Box2D;
let world;
let temp;
let temp2;
const PHYSICS_STEP = 1 / 60;
const MAX_STEPS_PER_STEP = 5;
const GRAVITY = 9.8;
let currentTime = now() / 1000;
let worldManifold;
let rayCastCallback;
const rayCastResult = create();
let raycastFixtureToIgnorePtr;
const contantPoint0 = create();
const contantPoint1 = create();
const normal = create();
function getWorldPointsAndNormalFromContact(contact) {
    contact.GetWorldManifold(worldManifold);
    const manifold = contact.GetManifold();
    const pointCount = manifold.get_pointCount();
    const b2_normal = worldManifold.get_normal();
    const b2_points_ptr = Box2D.getPointer(worldManifold.get_points());
    const b2_point0 = Box2D.wrapPointer(b2_points_ptr, Box2D.b2Vec2);
    const b2_point1 = Box2D.wrapPointer(b2_points_ptr + 8, Box2D.b2Vec2);
    set(normal, b2_normal.get_x(), b2_normal.get_y());
    const result = [normal];
    if (pointCount > 0) {
        set(contantPoint0, b2_point0.get_x(), b2_point0.get_y());
        result.push(contantPoint0);
    }
    if (pointCount > 1) {
        set(contantPoint1, b2_point1.get_x(), b2_point1.get_y());
        result.push(contantPoint1);
    }
    return result;
}
function raycast(x0, y0, x1, y1, fixtureToIgnore) {
    temp.Set(x0, y0);
    temp2.Set(x1, y1);
    raycastFixtureToIgnorePtr = Box2D.getPointer(fixtureToIgnore);
    set(rayCastResult, NaN, NaN);
    world.RayCast(rayCastCallback, temp, temp2);
    return !isNaN(rayCastResult[0]) ? rayCastResult : undefined;
}
function setVelocity(body, x, y) {
    const vel = body.GetLinearVelocity();
    temp.set_x(vel.get_x());
    temp.set_y(vel.get_y());
    if (x !== undefined) {
        temp.set_x(x);
    }
    if (y !== undefined) {
        temp.set_y(y);
    }
    // console.log("setVelocity", temp.get_x(), temp.get_y())
    body.SetLinearVelocity(temp);
}
function getVelocityX(body) {
    return body.GetLinearVelocity().get_x();
}
function getVelocityY(body) {
    return body.GetLinearVelocity().get_y();
}
function mulVelocity(body, x, y) {
    const vel = body.GetLinearVelocity();
    if (x !== undefined) {
        vel.set_x(vel.get_x() * x);
    }
    if (y !== undefined) {
        vel.set_y(vel.get_y() * y);
    }
    body.SetLinearVelocity(vel);
}
async function initPhysics() {
    Box2D = await Box2D$1();
    temp = new Box2D.b2Vec2(0.0, 0.0);
    temp2 = new Box2D.b2Vec2(0.0, 0.0);
    const gravity = new Box2D.b2Vec2(0.0, GRAVITY);
    world = new Box2D.b2World(gravity);
    worldManifold = new Box2D.b2WorldManifold();
    rayCastCallback = new Box2D.JSRayCastCallback();
    rayCastCallback.ReportFixture = (fixturePtr, point, _normal, fraction) => {
        if (fixturePtr === raycastFixtureToIgnorePtr) {
            return 1;
        }
        const p = Box2D.wrapPointer(point, Box2D.b2Vec2);
        set(rayCastResult, p.get_x(), p.get_y());
        return fraction;
    };
    const listener = new Box2D.JSContactListener();
    listener.BeginContact = (contactPtr) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const objA = getObjectByID(fixtureA.GetUserData());
        objA.contactStarted(contactPtr);
        const objB = getObjectByID(fixtureB.GetUserData());
        objB.contactStarted(contactPtr);
    };
    listener.EndContact = (contactPtr) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const objA = getObjectByID(fixtureA.GetUserData());
        objA.contactEnded(contactPtr);
        const objB = getObjectByID(fixtureB.GetUserData());
        objB.contactEnded(contactPtr);
    };
    listener.PreSolve = (contactPtr) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const objA = getObjectByID(fixtureA.GetUserData());
        objA.contactPresolve(contactPtr);
        const objB = getObjectByID(fixtureB.GetUserData());
        objB.contactPresolve(contactPtr);
    };
    listener.PostSolve = () => {
        //
    };
    world.SetContactListener(listener);
}
function createShape(obj) {
    const shape = new Box2D.b2PolygonShape();
    const physicsPoints = obj.graphics.physicsPoints;
    const scale$1 = getWorldScale(obj);
    const buffer = Box2D._malloc(physicsPoints.length * 8);
    let offset = 0;
    for (let i = 0; i < physicsPoints.length; i++) {
        const p = fromValues(physicsPoints[i][0], physicsPoints[i][1]);
        add(p, p, obj.graphics.pivot);
        if (obj.graphics.physicsPivot) {
            add(p, p, obj.graphics.physicsPivot);
        }
        scale(p, p, scale$1);
        Box2D.HEAPF32[(buffer + offset) >> 2] = p[0];
        Box2D.HEAPF32[(buffer + offset + 4) >> 2] = p[1];
        offset += 8;
    }
    const ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
    shape.Set(ptr_wrapped, physicsPoints.length);
    Box2D._free(buffer);
    return shape;
}
function physicsTypeToBox2D(physicsType) {
    let type = PhysicsType.NONE;
    switch (physicsType) {
        case PhysicsType.DYNAMIC: {
            type = Box2D.b2_dynamicBody;
            break;
        }
        case PhysicsType.KINEMATIC: {
            type = Box2D.b2_kinematicBody;
            break;
        }
        case PhysicsType.STATIC: {
            type = Box2D.b2_staticBody;
            break;
        }
    }
    return type;
}
function createFixture(obj, body) {
    if (obj.graphics.physicsType === PhysicsType.NONE) {
        return;
    }
    const shape = createShape(obj);
    const fixtureDef = new Box2D.b2FixtureDef();
    fixtureDef.set_shape(shape);
    fixtureDef.set_density(obj.graphics.density);
    fixtureDef.set_restitution(obj.graphics.restitution);
    fixtureDef.set_friction(obj.graphics.friction);
    fixtureDef.set_isSensor(obj.graphics.isSensor);
    const fixture = body.CreateFixture(fixtureDef);
    fixture.SetUserData(obj.id);
    obj.fixture = fixture;
}
function initPhysicsForObject(obj) {
    if (obj.body || obj.graphics.physicsType == PhysicsType.NONE) {
        return;
    }
    const physicsType = physicsTypeToBox2D(obj.graphics.physicsType);
    const bd = new Box2D.b2BodyDef();
    bd.set_type(physicsType);
    bd.set_fixedRotation(obj.graphics.fixedRotation);
    const body = world.CreateBody(bd);
    // body.SetAngularVelocity(-5)
    createFixture(obj, body);
    for (const slot in obj.attachments) {
        createFixture(obj.attachments[slot], body);
    }
    obj.body = body;
}
function addToPhysics(obj) {
    initPhysicsForObject(obj);
    const body = obj.body;
    if (!body) {
        return;
    }
    body.SetAwake(1);
    body.SetActive(1);
    syncPhysicsWithObj(obj);
}
function syncPhysicsWithObj(obj) {
    const body = obj.body;
    temp.Set(obj.x, obj.y);
    body.SetTransform(temp, obj.angle);
}
function syncObjWithPhysics(obj) {
    const body = obj.body;
    if (body ||
        obj.graphics.physicsType === PhysicsType.DYNAMIC ||
        obj.graphics.physicsType === PhysicsType.KINEMATIC) {
        const bpos = body.GetPosition();
        obj.x = bpos.get_x();
        obj.y = bpos.get_y();
        obj.angle = body.GetAngle();
    }
}
function physicsStep() {
    const time = now() / 1000;
    const stepCount = Math.trunc((time - currentTime) / PHYSICS_STEP);
    const stepsToSimulate = Math.min(stepCount, MAX_STEPS_PER_STEP);
    currentTime += stepCount * PHYSICS_STEP;
    for (let i = 0; i < stepsToSimulate; i++) {
        world.Step(PHYSICS_STEP, 20, 20);
    }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
function getWorldScale(obj) {
    const parent = getParent(obj);
    const parentWorldScale = parent ? getWorldScale(parent) : 1;
    return parentWorldScale * obj.scaleVec[0];
}
class GraphicsObject {
    graphics;
    static NEXT_OBJ_ID = 0;
    id = GraphicsObject.NEXT_OBJ_ID++;
    x = 0;
    y = 0;
    angle = 0;
    scale = 1;
    z = 0;
    mirror = false;
    angleIsWorldAngle = false;
    mat = create$7();
    startTime = 0;
    points = new Map();
    attachments = [];
    parent = undefined;
    worldMat = create$7();
    worldZ = 0;
    mvpMatrix = create$7();
    lastIndex = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body = undefined;
    fixture = undefined;
    contacts = new Map();
    onContactStart = undefined;
    onContactPresolve = undefined;
    onContactEnded = undefined;
    constructor(graphics) {
        this.graphics = graphics;
    }
    contactStarted(contactPtr) {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
        this.contacts.set(contactPtr, contact);
        this.onContactStart?.(contact);
    }
    contactPresolve(contactPtr) {
        const contact = this.contacts.get(contactPtr);
        this.onContactPresolve?.(contact);
    }
    contactEnded(contactPtr) {
        const contact = this.contacts.get(contactPtr);
        this.contacts.delete(contactPtr);
        this.onContactEnded?.(contact);
    }
    attach(slot, attachment) {
        if (this.attachments[slot] !== attachment) {
            attachment.reset();
            attachment.parent = this;
            this.attachments[slot] = attachment;
        }
    }
    reset() {
        this.startTime = now();
    }
    get mirrorMul() {
        return this.mirror ? -1 : 1;
    }
    get mirrorVec() {
        return fromValues(this.mirror ? -1 : 1, 1);
    }
    get scaleVec() {
        const scale = this.graphics.scale * this.scale;
        return fromValues(scale, scale);
    }
    get positionVec() {
        return fromValues(this.x, this.y);
    }
    calcLocalMatrix(parentWorldMatrix) {
        const m = this.mat;
        identity$4(m);
        if (this.graphics.attachPoint) {
            if (!this.parent) {
                throw new Error("Attachment without a parent.");
            }
            const attachmentInfo = getAttachmentInfo(this.parent, this.graphics.attachPoint, this.graphics.attachT);
            if (attachmentInfo) {
                mul$7(m, m, attachmentInfo.m);
            }
        }
        if (this.angleIsWorldAngle && parentWorldMatrix) {
            const parentAngle = getAngleFromMatrix(parentWorldMatrix);
            const currentAngle = getAngleFromMatrix(m);
            rotate$4(m, m, -parentAngle);
            rotate$4(m, m, -currentAngle);
        }
        translate$3(m, m, this.positionVec);
        rotate$4(m, m, this.angle);
        scale$7(m, m, this.scaleVec);
        scale$7(m, m, this.mirrorVec);
        if (this.graphics) {
            translate$3(m, m, this.graphics.pivot);
        }
        return m;
    }
    calcWorldMatrix() {
        const parentWorldMatrix = getParentWorldMatrix(this);
        mul$7(this.worldMat, parentWorldMatrix, this.calcLocalMatrix(parentWorldMatrix));
        return this.worldMat;
    }
    getWorldMatrix() {
        return this.worldMat;
    }
    setPoint(pointName, point, obj) {
        this.points.set(pointName, {
            point,
            obj,
        });
    }
}

const TORSO_SLOT = 0;
const ARMS_SLOT = 1;
const HEAD_SLOT = 2;
const WEAPON_SLOT = 3;
const SHOOT_LINE_SLOT = 4;
const EYE_LINE_SLOT = 5;
const idle_torso_graphics = new Graphics("idle", "torso_legs");
const idle_arms_graphics = new Graphics("idle", "arms");
const run_torso_graphics = new Graphics("run", "torso_legs");
const fall_torso_graphics = new Graphics("fall", "torso_legs");
const jump_start_torso_graphics = new Graphics("jump_start", "torso_legs");
const aiming_arms_graphics = new Graphics("aiming", "arms");
const oleg_graphics = new Graphics("oleg");
const misha_graphics = new Graphics("misha");
const blaster_graphics = new Graphics("blaster");
const shoot_line_graphics = new Graphics("shoot-line");
const eye_line_graphics = new Graphics("eye-line");
const FOOT_START = 0.02;
const FOOT_HEIGHT = 0.27;
const FOOT_HEIGHT_PADDING = 0.1;
const FOOT_FULL_HEIGHT = FOOT_HEIGHT + FOOT_HEIGHT_PADDING;
async function loadCharacterAnimations() {
    await Promise.all([
        idle_torso_graphics.load(),
        idle_arms_graphics.load(),
        run_torso_graphics.load(),
        fall_torso_graphics.load(),
        jump_start_torso_graphics.load(),
        aiming_arms_graphics.load(),
        oleg_graphics.load(),
        misha_graphics.load(),
        blaster_graphics.load(),
        shoot_line_graphics.load(),
        eye_line_graphics.load(),
    ]);
}
const characters = [];
const MAX_SPEED_ON_FOOT = 7;
const ACCELERATION_ON_FOOT = MAX_SPEED_ON_FOOT / 0.25;
const ACCELERATION_IN_AIR = ACCELERATION_ON_FOOT * 1;
class Character {
    name;
    idle_torso = new GraphicsObject(idle_torso_graphics);
    // private readonly idle_arms = new GraphicsObject(idle_arms_graphics)
    run_torso = new GraphicsObject(run_torso_graphics);
    fall_torso = new GraphicsObject(fall_torso_graphics);
    jump_start_torso = new GraphicsObject(jump_start_torso_graphics);
    aiming_arms = new GraphicsObject(aiming_arms_graphics);
    head;
    blaster = new GraphicsObject(blaster_graphics);
    shootLine = new GraphicsObject(shoot_line_graphics);
    eyeline = new GraphicsObject(eye_line_graphics);
    objGraphics = createDummyGraphics();
    obj = new GraphicsObject(this.objGraphics);
    onBeforePhysics;
    onAfterPhysics;
    touchingGround = false;
    isMoving = false;
    movingDirection = 0;
    currentSpeed = 0;
    preparingToJump = false;
    isJumping = false;
    gravityForJumpFall = 0;
    constructor(name, isOleg) {
        this.name = name;
        this.objGraphics.physicsType = PhysicsType.DYNAMIC;
        this.objGraphics.fixedRotation = true;
        const WIDTH = 0.2;
        this.objGraphics.physicsPoints = [
            fromValues(-WIDTH / 2, 0),
            fromValues(-WIDTH / 2, 0.5),
            fromValues(0, 1 - FOOT_HEIGHT),
            fromValues(WIDTH / 2, 0.5),
            fromValues(WIDTH / 2, 0),
        ];
        this.objGraphics.physicsPivot = fromValues(0, -1);
        this.obj.attach(TORSO_SLOT, this.idle_torso);
        this.aiming_arms.z = 0.2;
        this.head = new GraphicsObject(isOleg ? oleg_graphics : misha_graphics);
        this.head.angle = 1.57;
        this.head.z = 0.1;
        this.obj.attach(HEAD_SLOT, this.head);
        this.blaster.z = -0.05;
        this.obj.attach(WEAPON_SLOT, this.blaster);
        this.shootLine.z = -0.01;
        this.obj.attach(SHOOT_LINE_SLOT, this.shootLine);
        this.eyeline.z = -0.01;
        this.obj.attach(EYE_LINE_SLOT, this.eyeline);
        this.obj.attach(ARMS_SLOT, this.aiming_arms);
        //
        this.obj.scale = 2;
        // this.obj.y = -1
        this.onBeforePhysics = () => {
            this.changeSpeed(0);
        };
    }
    changeSpeed(dstVelocity, velocityMul = 1) {
        const dstDirection = Math.sign(dstVelocity);
        this.movingDirection = dstDirection;
        const velX = getVelocityX(this.obj.body) * velocityMul;
        const delta = dstVelocity - velX;
        const direction = Math.sign(delta);
        const speed = Math.abs(delta);
        const acceleration = this.touchingGround ? ACCELERATION_ON_FOOT : ACCELERATION_IN_AIR;
        const dt = getDT();
        const velocityDiff = direction * Math.min(acceleration * dt, speed);
        const newVelocityX = velX + velocityDiff;
        const cappedVelocityX = dstDirection * Math.min(newVelocityX * dstDirection, MAX_SPEED_ON_FOOT);
        setVelocity(this.obj.body, cappedVelocityX, undefined);
    }
    updateAnimation() {
        if (this.touchingGround) {
            if (!this.isMoving) {
                if (this.preparingToJump) {
                    this.obj.attach(TORSO_SLOT, this.jump_start_torso);
                }
                else {
                    this.obj.attach(TORSO_SLOT, this.idle_torso);
                }
            }
            else {
                this.obj.attach(TORSO_SLOT, this.run_torso);
            }
        }
        else {
            this.obj.attach(TORSO_SLOT, this.fall_torso);
        }
    }
    setSpeed(speed) {
        setVelocity(this.obj.body, speed, undefined);
        this.currentSpeed = speed;
        this.updateAnimation();
    }
    steerSpeed(speed) {
        setVelocity(this.obj.body, getVelocityX(this.obj.body) + speed, undefined);
        this.updateAnimation();
    }
    aimAt(p) {
        this.obj.attach(ARMS_SLOT, this.aiming_arms);
        aimAt(p, this.aiming_arms, "barrel");
        const oldHeadAngle = this.head.angle;
        aimAt(p, this.head, "eyeline");
        if (this.head.angle < -1.1 || this.head.angle > 1.2) {
            this.head.angle = oldHeadAngle;
        }
    }
    attachToGround() {
        this.touchingGround = false;
        if (getVelocityY(this.obj.body) >= -10e-5) {
            const footStart = FOOT_START * this.obj.scale;
            const footHeight = (this.touchingGround ? FOOT_FULL_HEIGHT : FOOT_HEIGHT) * this.obj.scale;
            const footY = this.obj.y - FOOT_HEIGHT * this.obj.scale;
            const p = raycast(this.obj.x, footY - footStart, this.obj.x, footY + footHeight, this.obj.fixture);
            if (p) {
                this.obj.y = p[1];
                syncPhysicsWithObj(this.obj);
                setVelocity(this.obj.body, undefined, 0);
                this.touchingGround = true;
                this.isJumping = false;
            }
        }
        if (!this.touchingGround) {
            this.preparingToJump = false;
        }
        this.updateAnimation();
    }
    beforePhysics() {
        this.onBeforePhysics?.();
        if (this.isJumping) {
            // is decending?
            if (getVelocityY(this.obj.body) > 10e-4) {
                this.obj.body.SetGravityScale(this.gravityForJumpFall / GRAVITY);
            }
        }
        else {
            this.obj.body.SetGravityScale(2);
        }
    }
    afterPhysics() {
        this.attachToGround();
        this.onAfterPhysics?.();
    }
    startJump() {
        this.preparingToJump = true;
        this.updateAnimation();
    }
    cancelJump() {
        this.preparingToJump = false;
    }
    jump(jumpPower) {
        this.preparingToJump = false;
        const velX = getVelocityX(this.obj.body);
        const jumpDistance = velX * 0.5 * jumpPower; // horizontal distance for jump
        const jumpHeight = -2.2 * jumpPower; // height for jump
        let th = jumpDistance / velX;
        if (isNaN(th)) {
            th = 0.4 * jumpPower;
        }
        // vertical speed
        const velocityForJump = (2 * jumpHeight) / th;
        const gravityForJump = (-2 * jumpHeight) / (th * th);
        this.gravityForJumpFall = gravityForJump * 1.2;
        this.obj.body.SetGravityScale(gravityForJump / GRAVITY);
        setVelocity(this.obj.body, undefined, velocityForJump);
        this.isJumping = true;
        this.updateAnimation();
    }
}
function addCharacter(character) {
    addToScene(character.obj);
    characters.push(character);
}
function charactersBeforePhysics() {
    for (const char of characters) {
        char.beforePhysics();
    }
}
function charactersAfterPhysics() {
    for (const char of characters) {
        char.afterPhysics();
    }
}

async function initScene() {
    await loadCharacterAnimations();
    createPlayer();
    addCharacter(player);
    addCharacter(new Character("misha", false));
    const box = new GraphicsObject(await createGraphics("box"));
    box.x = 4;
    box.y = -0.25;
    box.z = -1;
    box.angle = 0;
    box.graphics.physicsType = PhysicsType.STATIC;
    addToScene(box);
    const COUNT = 3;
    const FLOORS_COUNT = 10;
    const dirt_graphics = await createGraphics("dirt");
    const angle = 0;
    for (let j = 0; j < FLOORS_COUNT; j++) {
        for (let i = -COUNT / 2; i < COUNT; i++) {
            const l = 10 * i;
            const dirt = new GraphicsObject(dirt_graphics);
            dirt.scale = 10;
            dirt.x = Math.cos(angle) * l * (j + 1);
            dirt.y = Math.sin(angle) * l - j * 1.8;
            dirt.z = 1;
            dirt.angle = angle;
            addToScene(dirt);
        }
    }
}

function tick(time) {
    setNow(time);
    handleResize();
    charactersBeforePhysics();
    physicsStep();
    syncPhysics();
    charactersAfterPhysics();
    drawScene();
    requestAnimationFrame(tick);
}
async function main() {
    await initPhysics();
    await initScene();
    requestAnimationFrame(tick);
}
main();
//# sourceMappingURL=index.js.map
