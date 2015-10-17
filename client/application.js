App.onLaunch = function(options) {
  // Create an object to store our catalog entries in
  var data = {
    "swift"      : null,
    "ruby"       : null,
    "go"         : null,
    "javascript" : null
  };

  // Take an XML string and turn it into a parse into a proper DOM
  function parse(xml) {
    var parser = new DOMParser();

    return parser.parseFromString(xml, "application/xml");
  }

  // A quick utility for displaying a loading page
  function displayLoading() {
    var loading = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
     <loadingTemplate>
        <activityIndicator>
           <title>Loading...</title>
        </activityIndicator>
     </loadingTemplate>
    </document>`;

    navigationDocument.pushDocument(parse(loading));
  }

  // Display video media in full-screen
  function displayVideo(event) {
    var url = event.target.getAttribute("video", url);

    if (url) {
      var player = new Player();
      var playlist = new Playlist();
      var mediaItem = new MediaItem("video", url);

      player.playlist = playlist;
      player.playlist.push(mediaItem);
      player.present();
    }
  }

  // Refresh the catalog and render the navigation and video list
  function refreshCatalog() {
    if (data["swift"] && data["ruby"] && data["go"] && data["javascript"]) {
      var catalog = '<?xml version="1.0" encoding="UTF-8" ?><document><catalogTemplate><banner><title>Manticore TV</title></banner><list>';

			for (topic in data)
			{
        console.log('looping through topic ' + topic);

				catalog += `<section>
					<listItemLockup>
						<title>${topic}</title>
						<decorationLabel>${data[topic]["videos"].length}</decorationLabel>
						<relatedContent>
							<grid>
								<section>`;

        for (i = 0; i < data[topic]["videos"].length; i++)
        {
          console.log('looping through videos');
          console.log(data[topic]["videos"][i]);

          if (data[topic]["videos"][i].mp4) {
            console.log('has video, create lockup');
            catalog += `<lockup video="${data[topic]["videos"][i].mp4}">
              <img src="${data[topic]["videos"][i].cover}" width="550" height="275" />
              <title>${data[topic]["videos"][i].name}</title>
            </lockup>`;
          }
        }

        catalog += `</section>
							</grid>
						</relatedContent>
					</listItemLockup>
				</section>`;
      }

      catalog += `</list></catalogTemplate></document>`;
      var catalogDoc = parse(catalog);
      catalogDoc.addEventListener("select", displayVideo);
      navigationDocument.pushDocument(catalogDoc);
    }
  }

  // Fetch data from an API / server
  function fetchData(topic) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function()
    {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          data[topic] = JSON.parse(httpRequest.responseText);

          console.log(data[topic]["videos"][0].mp4);
          refreshCatalog();
        }
      }
    }

    httpRequest.open('GET', 'https://rails-api-cache.herokuapp.com/api/videos.json');
    httpRequest.send();
  }

  // Commented out for demo, but useful to use for error messages and loading statuses
  // displayLoading();

  // Loop through the topics and fetch the results from the API
  for (topic in data) {
    fetchData(topic);
  }
}