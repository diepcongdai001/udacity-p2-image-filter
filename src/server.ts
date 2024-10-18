import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const fs = require('fs');

(async() => {
  // Init the Express application
  const app = express();
  
  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  
    /**************************************************************************** */
    // app.use(express.json());
    const path_save:string = "/util/tmp/";
    app.get('/filteredimage', async (req: Request, res: Response, next: NextFunction) => {
        const { image_url } = req.query;
    
        if (!image_url) {
            return next('Missing image_url query parameter.');
        }
        try {
            let absolutePath: string = await filterImageFromURL(image_url.toString()) as string;
            res.sendFile(absolutePath);
            fs.readdir(__dirname + path_save, (err: Error, files: string[]) => {
              const fileList: string[] = [];
              files.forEach((file: string) => {
                fileList.push(__dirname + path_save + file);
              });
              deleteLocalFiles(fileList);
            });
            return;
        } catch (error) {
            console.error('Error filtering image:', error);
            next('Error filtering image.');
        }
    });
    
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  
  // Start the Server
  app.listen(port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
});
  
