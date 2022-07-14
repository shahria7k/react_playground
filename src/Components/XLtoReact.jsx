import { useState, useEffect } from "react";

import * as XLSX from "xlsx";
import { Table, Container } from "react-bootstrap";
export const XLtoReact = () => {
	const [data, setData] = useState({ cols: [], rows: [], header: [] });
	const [effect, setEffect] = useState(null);
	const fileHandler = (event) => {
		let fileObj = event.target.files[0];

		//just pass the fileObj as parameter
		setEffect(
			ExcelRenderer(fileObj, (err, resp) => {
				if (err) {
					console.log(err);
				} else {
					// console.log(resp);
					const h = resp.rows.shift();
					// console.log(h);
					setData({ rows: resp.rows, cols: resp.cols, header: h });
				}
			})
		);
	};
	useEffect(() => {
		console.log(effect);
	}, [effect]);
	return (
		<div className="App">
			<input type="file" onInput={fileHandler} placeholder="Drop your files" />
			<hr />
			<Container>
				<Table responsive striped bordered hover size="sm" variant="dark">
					<thead>
						<tr>
							{data.header.map((_, index) => (
								<th key={index}>{_}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.rows.map((_, i) => {
							const r = _.join(" ").split(" ");
							return (
								<tr key={"row_" + i}>
									{data.header.map((d, j) => {
										return (
											<td key={"d_" + j} contentEditable>
												{r[j] || ""}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Container>
		</div>
	);
};
const ExcelRenderer = (file, callback) => {
	return new Promise(function (resolve, reject) {
		var reader = new FileReader();
		var rABS = !!reader.readAsBinaryString;
		reader.onload = function (e) {
			/* Parse data */
			var bstr = e.target.result;
			var wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

			/* Get first worksheet */
			var wsname = wb.SheetNames[0];
			var ws = wb.Sheets[wsname];

			/* Convert array of arrays */
			var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
			var cols = make_cols(ws["!ref"]);

			var data = { rows: json, cols: cols };
			if (data) {
				resolve(data);
				return callback(null, data);
			} else {
				resolve("No data found");
			}
		};
		if (file && rABS) reader.readAsBinaryString(file);
		else reader.readAsArrayBuffer(file);
	});
};
const make_cols = (refstr) => {
	var o = [],
		C = XLSX.utils.decode_range(refstr).e.c + 1;
	for (var i = 0; i < C; ++i) {
		o[i] = { name: XLSX.utils.encode_col(i), key: i };
	}
	console.log(o);
	return o;
};
