
// var data = [
// 	{label:'blah', left:10, right:20},
// 	{label:'food', left:20, right:15},
// 	{label:'drink', left:5, right:12},
// ]

//label, val1, val2

WIDTH = 500;
HEIGHT = 750;

LEFT_MARGIN = 150;
RIGHT_MARGIN = 150;
TOP_MARGIN = 50;
BOTTOM_MARGIN = 50;

ELIGIBLE_SIZE = HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

function _max_key(v){
	var vi, max_side;
	var _m = undefined;
	for (var i = 0; i < v.length; i += 1){
		vi = v[i];
		max_side = Math.max(vi.left, vi.right)
		if (_m == undefined || max_side > _m) {
			_m = max_side;
		}
	}
	return _m;
}


function _min_key(v){
	var vi, min_side;
	var _m = undefined;
	for (var i = 0; i < v.length; i += 1){
		vi = v[i];
		min_side = Math.min(vi.left, vi.right)
		if (_m == undefined || min_side < _m) {
			_m = min_side;
		}
	}
	return _m;
}

function _min_max(v){
	var vi, min_side, max_side;
	var min_left, min_right, max_left, max_right;
	var _max = undefined;
	var _min = undefined;

	var _min_left = undefined;
	var _min_right = undefined;
	var _max_left = undefined;
	var _max_right = undefined;

	for (var i = 0; i < v.length; i += 1){
		vi = v[i];
		min_side = Math.min(vi.left_coord, vi.right_coord);
		max_side = Math.max(vi.left_coord, vi.right_coord);



		if (_min == undefined || min_side < _min) {
			_min = min_side;
		}
		if (_max == undefined || max_side > _max) {
			_max = max_side;
		}

		if (_min_left == undefined || vi.left_coord < _min_left) {
			_min_left = vi.left_coord;
		}
		if (_max_left == undefined || vi.left_coord > _max_left) {
			_max_left = vi.left_coord;
		}
		if (_min_right == undefined || vi.right_coord < _min_right) {
			_min_right = vi.right_coord;
		}
		if (_max_right == undefined || vi.right_coord < _max_right) {
			_max_right = vi.right_coord;
		}


	}
	return [_min, _max];
}

//console.log(_min_key(data), _max_key(data))

var _y = d3.scale.linear()
			.domain([_min_key(data), _max_key(data)])
			.range([TOP_MARGIN, HEIGHT-BOTTOM_MARGIN])

function y(d,i){
	return HEIGHT - _y(d)
}


function _slopegraph_preprocess(d){
	// computes y coords for each data point
	var offset;

	var font_size = 15;
	var l = d.length;

	var max = _max_key(d);
	var min = _min_key(d);
	var range = max-min;

	for (var i = 0; i < d.length; i += 1){
		d[i].left_coord = y(d[i].left);
		d[i].right_coord = y(d[i].right);
	}

	// order the left side by left values.

	function shift_values(d, side){
		//
		var other_side = side === 'left' ? 'right' : 'left';

		d.sort(function(a,b){
			if (a[side] < b[side]){
				return -1
			} else if (a[side] > b[side]){
				return 1
			} else {
				if (a.label > b.label){
					// sort alphabetically
					return 1
				} else {
					return -1				
				}
			}
		}).reverse()

		var d1, d2;

		for (var i = 0; i < d.length; i += 1){
			//d[i][side + '_coord'] = y(d[i][side]
			if (i < d.length-1 && d[i][side + '_coord'] + font_size > d[i+1][side + '_coord']){

				offset = d[i][side + '_coord'] + font_size - d[i+1][side + '_coord'];

				for (var j = i+1; j < d.length; j += 1){
					// if (j > 0 && d[j][side + '_coord']  + font_size < d[j+1][side + '_coord']) {

					// }
					d[j][side + '_coord'] = d[j][side + '_coord'] + offset;
					//d[j][other_side + '_coord'] = d[j][other_side + '_coord'] + offset;



				}
			}
		}
		return d
	}

	d = shift_values(d, 'left');
	//console.log(d)
	d = shift_values(d, 'right');
	// console.log(d)

	// compute a new y.


	return d;
}

data = _slopegraph_preprocess(data)
var min, max;
var _ = _min_max(data)
min = _[0]
max = _[1]

_y = d3.scale.linear()
	.domain([max, min])
	.range([TOP_MARGIN, HEIGHT-BOTTOM_MARGIN])

function y(d,i){
	return HEIGHT - _y(d)
}

var sg = d3.select('#slopegraph')
	.append('svg:svg')
	.attr('width', WIDTH)
	.attr('height', HEIGHT);

sg.selectAll('.left_labels')
	.data(data).enter().append('svg:text')
		.attr('x', LEFT_MARGIN)
		.attr('y', function(d,i){
			return y(d.left_coord)
		})
		.attr('dy', '.35em')
		.attr('dx', -10)
		.attr('font-size', 10)
		.attr('text-anchor', 'end')
		.text(function(d,i){ return d.label + '   ' + d.left})
		.attr('fill', 'black')

// sg.selectAll('.left_values')
// 	.data(data).enter().append('svg:text')
// 		.attr('x', LEFT_MARGIN)
// 		.attr('y', function(d,i){
// 			return y(d.left)
// 		})
// 		.attr('dy', '.35em')
// 		.attr('dx', -15)
// 		.attr('text-anchor', 'end')
// 		.text(function(d,i){ return d.left})
// 		.attr('fill', 'black')

sg.selectAll('.right_labels')
	.data(data).enter().append('svg:text')
		.attr('x', WIDTH-RIGHT_MARGIN)
		.attr('y', function(d,i){
			return y(d.right_coord)
		})
		.attr('dy', '.35em')
		.attr('dx', 10)
		.attr('font-size', 10)
		.text(function(d,i){ return  + d.right + ' ' + d.label})
		.attr('fill', 'black')

sg.append('svg:text')
	.attr('x', LEFT_MARGIN)
	.attr('y', TOP_MARGIN/2)
	.attr('text-anchor', 'end')
	.attr('opacity', .5)
	.text(min_year)

//
sg.append('svg:text')
	.attr('x', WIDTH-RIGHT_MARGIN)
	.attr('y', TOP_MARGIN/2)
	.attr('opacity', .5)
	.text(max_year)

sg.append('svg:line')
	.attr('x1', LEFT_MARGIN/2)
	.attr('x2', WIDTH-RIGHT_MARGIN/2)
	.attr('y1', TOP_MARGIN*2/3)
	.attr('y2', TOP_MARGIN*2/3)
	.attr('stroke', 'black')
	.attr('opacity', .5)

sg.append('svg:text')
	.attr('x', WIDTH/2)
	.attr('y', TOP_MARGIN/2)
	.attr('text-anchor', 'middle')
	.text('UFO Sightings\n (By Shape)')
	.attr('font-variant', 'small-caps')

sg.selectAll('.slopes')
	.data(data).enter().append('svg:line')
		.attr('x1', LEFT_MARGIN)
		.attr('x2', WIDTH-RIGHT_MARGIN)
		.attr('y1', function(d,i){
			return y(d.left_coord)
		})
		.attr('y2', function(d,i){
			return y(d.right_coord)
		})
		.attr('opacity', .5)
		.attr('stroke', 'black')
