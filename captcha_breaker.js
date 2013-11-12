function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function getPixel(imageData, x, y) {
    index = (x + y * imageData.width) * 4;

    return [imageData.data[index+0], imageData.data[index+1],
    		imageData.data[index+2], imageData.data[index+3]];
}

$("#captcha").load(function() {
	//Load Image into Canvas
	var img = $('#captcha')[0];
	var canvas = $('<canvas/>')[0];
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

	var width = img.width;
	var height = img.height;
	var imgData = canvas.getContext('2d').getImageData(0,0,width,height);

	for(var x = 0; x < width - 1; ++x)
		for(var y = 0; y < height - 1; ++y){
			//It's a greyscale image so we'll only care
			//about one of the color components
			tlpxl = getPixel(imgData, x, y)[0];
			trpxl = getPixel(imgData, x + 1, y)[0];
			blpxl = getPixel(imgData, x, y + 1)[0];
			brpxl = getPixel(imgData, x + 1, y + 1)[0];

			if(tlpxl > 100 && tlpxl < 203 || tlpxl > 204){
				setPixel(imgData, x, y,   0,0,0,255);
			}
		}

	//Remove noise from the captcha
	for(var x = 0; x < width - 1; ++x)
		for(var y = 0; y < height - 1; ++y){
			//It's a greyscale image so we'll only care
			//about one of the color components
			tlpxl = getPixel(imgData, x, y)[0];
			trpxl = getPixel(imgData, x + 1, y)[0];
			blpxl = getPixel(imgData, x, y + 1)[0];
			brpxl = getPixel(imgData, x + 1, y + 1)[0];

			//TEM DE FICAR A 13 para ser incluido no proximo for
			if(tlpxl > 180 && tlpxl < 190  && tlpxl == trpxl){
				setPixel(imgData, x, y,   13,255,13,255);
				setPixel(imgData, x, y+1, 13,255,13,255);
				setPixel(imgData, x, y+2, 13,255,13,255);
				setPixel(imgData, x, y-1, 13,255,13,255);
				setPixel(imgData, x, y-2, 13,255,13,255);
			}

			if(tlpxl > 180 && tlpxl < 190  && tlpxl == blpxl){
				setPixel(imgData, x, y,   13,255,13,255);
				setPixel(imgData, x, y+1, 13,255,13,255);
				setPixel(imgData, x, y+2, 13,255,13,255);
				setPixel(imgData, x, y-1, 13,255,13,255);
				setPixel(imgData, x, y-2, 13,255,13,255);
			}

			if(tlpxl == 13 || (tlpxl < 200 && tlpxl == trpxl && trpxl == blpxl && blpxl == brpxl))
				setPixel(imgData, x, y, 255,0,0,255);
			else
				setPixel(imgData, x, y, 255,255,255,255);
		}

	

	canvas.getContext('2d').putImageData(imgData, 0, 0); // at coords 0,0
	$("#captcha").after(canvas);
});
