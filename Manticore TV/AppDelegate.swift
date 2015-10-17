import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

  var window: UIWindow?
  
  var appController: TVApplicationController?


  func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    window = UIWindow(frame: UIScreen.mainScreen().bounds)
    
    // Create the TVApplicationControllerContext for this application
    let appControllerContext = TVApplicationControllerContext()
    
    // The JavaScript URL is used to create the JavaScript context for your TVMLKit application
    if let url = NSURL(string: "http://localhost:4000/client.js") {
      appControllerContext.javaScriptApplicationURL = url
    }
    
    // Set the properties that will be passed to the `App.onLaunch` function in JavaScript
    if let launchOptions = launchOptions as? [String: AnyObject] {
      for (kind, value) in launchOptions {
        appControllerContext.launchOptions[kind] = value
      }
    }
    
    appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
    
    
    return true
  }

}

