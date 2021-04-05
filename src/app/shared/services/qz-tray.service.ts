import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { from } from 'rxjs';

import * as shajs from 'sha.js';
import * as qz from 'qz-tray';
declare var KJUR: any;
declare var KEYUTIL: any;
declare var stob64: any;
declare var hextorstr: any;
declare var RSAKey: any;


var RSVP = require('rsvp') as any;
qz.api.setPromiseType(function promise(resolver) { return new RSVP.Promise(resolver); });
qz.api.setSha256Type(function (data) {
  return shajs('sha256').update(data).digest('hex')
});



qz.security.setCertificatePromise(function (resolve, reject) {
  resolve("-----BEGIN CERTIFICATE-----\n" +
  `MIIEjjCCA3agAwIBAgIJAMeeV7TVMKVoMA0GCSqGSIb3DQEBBQUAMIGKMQswCQYD
  VQQGEwJWTjEMMAoGA1UECBMDSENNMQ8wDQYDVQQHEwZIb2NNb24xDTALBgNVBAoT
  BE5FVFMxCzAJBgNVBAsTAklUMRswGQYDVQQDFBIqLnRpZW1iYW5obmdvbi5jb20x
  IzAhBgkqhkiG9w0BCQEWFGh1bmdiaWxsODhAZ21haWwuY29tMCAXDTE5MTIxNjA5
  MTc0NVoYDzIwNTEwNjEwMDkxNzQ1WjCBijELMAkGA1UEBhMCVk4xDDAKBgNVBAgT
  A0hDTTEPMA0GA1UEBxMGSG9jTW9uMQ0wCwYDVQQKEwRORVRTMQswCQYDVQQLEwJJ
  VDEbMBkGA1UEAxQSKi50aWVtYmFuaG5nb24uY29tMSMwIQYJKoZIhvcNAQkBFhRo
  dW5nYmlsbDg4QGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
  ggEBAMCHas/I228mPCkBtlvEomwF4ZY0w6crQ5K2Iye2rPN3W/Ks+mjHq2niVDdU
  416gYBb6zBoC30dGMb62zWUTnXqFrX4x/XQ6XHp8IqpU/f1G7xlMQiBU+mB4F7ye
  zJrV7EiwuZt+cynCeZ+yy/QSyPbqYPXLj5hCUpSnz07AcmUZRa9rtFo1L2+kf3yj
  Wqg3SGiSNjcLwEzV3nMWM0rBoprhdJNpOxBc7dwZ/aTXtoBvfIZ5IKfvSbS+bMyy
  Adx3sJ9TTHkjWWgV64i2IbTXY66R+G26cKubojb/Y+zq7KkJCMMmY+Bt2yMJUUCY
  rJYa9N4+EcrG1usg2V5fP6hHVkMCAwEAAaOB8jCB7zAdBgNVHQ4EFgQUVxL2pKfr
  ErUUmxi7mAWIw7kxJJowgb8GA1UdIwSBtzCBtIAUVxL2pKfrErUUmxi7mAWIw7kx
  JJqhgZCkgY0wgYoxCzAJBgNVBAYTAlZOMQwwCgYDVQQIEwNIQ00xDzANBgNVBAcT
  BkhvY01vbjENMAsGA1UEChMETkVUUzELMAkGA1UECxMCSVQxGzAZBgNVBAMUEiou
  dGllbWJhbmhuZ29uLmNvbTEjMCEGCSqGSIb3DQEJARYUaHVuZ2JpbGw4OEBnbWFp
  bC5jb22CCQDHnle01TClaDAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IB
  AQACg4S1RM/x4Q+UlS0g2aYc3/+6R5jzyxqNzbJUaGRhjqGd0gleiqTJl/KM4aLt
  PsCecAyPGS7oEMFFDkztw1B0c6Y5OtTfgF8V7N5Zocdaq3boAVBss3Strwe59yG5
  zRWvSAmcd5b49BmkEqv+z6hg+rJYy9bwQf8JeeQjBR7ib2cgCyzPXvk5wp01V4mM
  a6S0Q7HgR+ixxpYTInwQUVHcjMvbwglTE7OZjKOvJ9LQ9CQMspabYnAay0y1U5hq
  6X0DELZNILL4GW4G9DJHDYdVFKwlFR0FPClJwIjyDM9dYcmCiD4nvhRgLMOTVb5V
  xpqYu6a5vu19DiqCEqB44pdr\n` +
  "-----END CERTIFICATE-----");
});

var privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
        `MIIEpAIBAAKCAQEAwIdqz8jbbyY8KQG2W8SibAXhljTDpytDkrYjJ7as83db8qz6
        aMeraeJUN1TjXqBgFvrMGgLfR0YxvrbNZROdeoWtfjH9dDpcenwiqlT9/UbvGUxC
        IFT6YHgXvJ7MmtXsSLC5m35zKcJ5n7LL9BLI9upg9cuPmEJSlKfPTsByZRlFr2u0
        WjUvb6R/fKNaqDdIaJI2NwvATNXecxYzSsGimuF0k2k7EFzt3Bn9pNe2gG98hnkg
        p+9JtL5szLIB3Hewn1NMeSNZaBXriLYhtNdjrpH4bbpwq5uiNv9j7OrsqQkIwyZj
        4G3bIwlRQJislhr03j4RysbW6yDZXl8/qEdWQwIDAQABAoIBAGXJ8p3CislcBKiF
        gD1KW7kS7u60HNEQHZy+cR25Bf1+mH1YGNg24JiNkYrjdYZ88fCUTj5eUF/la71x
        9mu/EB5L+KrkkSTXCjez07wMTXCQBS9x0vA3HVzNgXc22ePuwAq6bJcaJpboe9cD
        97KmD9wDlJm/Mr8EKZbwlbkEJDbwV9Znrv8unEwz8vEzHd60r5EeIJJJToUwqe37
        8jp/BW4zVFUq5Yhaks6yVmd88jRpSzKnzPqSaYz7S4xQusqg8hzlGmwvFe3RAnsW
        khmCK4OIJRwpmK8W1gGjvz2mN/jcXlnTMW8drZllghteD8zFEgYECor3HoSmPu4x
        i8kZtUkCgYEA35qoCnbJlWu5jNxWcElyl/y5njObGWhj6xf85y61LJyEMVxwpycX
        pk07OZlvuvuMhk0pxwqhlHI9lISvLCnxDe6XPeb1FnXMzEhmiwvteMl8Ko3tYfts
        GEN/Q7f5ymZaCjzPJqJR4kf6c+3uXQdWV4U3ld3JpkQBq8g7ojLFyP8CgYEA3Gwz
        srQlHOjDfiPOSRkR0mMZuYRFqvHl42CciRjtzpuznxQDz3HnNZ/eqV+ws4Jg02U5
        /E3Jcp7+AAa5rJm9Zmytun8bh/gq0A/T9RUuWyBm0CPjGRnMe23zL5nsRIb2514/
        Vf3MyvzyoTvv95mqtmavm30lblUt0y+3xkC8Dr0CgYEAytpkfnG7eUnsYGT4KhAH
        3OiSgHoyx/8TPpFZh2WxSVKI/rrtHEdzxhQkmaGgYlKY7rIMJ512btShFx60SG2Y
        WVpNbQQc7o5aCC3akWR1wHGRqo1tgMl2DCEX0JiUDVGDd+woxdTWUmGYThnZeB4S
        731Uqyo1KRhjJ7OUnhZPpoMCgYAk8xZvfHdEM1iiCoqIAmXUaLxlNuEe2NH6nbVf
        3gfvPHaN0iMZYTSq7pO6vMm4LcDhbvSbcMa2KiTWCEqTvmnbg5hTzP7mehljK2QS
        j2xn5jSV644kJQj8H+BGOH08t4soGcpwNc1gsapSkOOXE/FkBi6l2AKwTiMSZcte
        tndP2QKBgQDGqpVFGtYc4nXt2F+FB12SMSPDpkN5iSncVSwyD/9TrXD1as3CWKUg
        KgQAOWaxMy4FeXgfQcBppeoY/ejGQvdBaZWihQRXKhWrrCvOxwfs2WZoYA0/gCN+
        ZLxXc/a+f/9/3F/QkAhzg7Ksy7VrSf4K5Lr57yoUrFI3EDDByLN3PQ==\n` +
        "-----END RSA PRIVATE KEY-----";

        qz.security.setSignaturePromise(function(toSign) {
          return function(resolve, reject) {
              try {
                  var pk = KEYUTIL.getKey(privateKey);
                  var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
                  sig.init(pk); 
                  sig.updateString(toSign);
                  var hex = sig.sign();
                  console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
                  resolve(stob64(hextorstr(hex)));
              } catch (err) {
                  console.error(err);
                  reject(err);
              }
          };
      });



@Injectable({
  providedIn: 'root'
})
export class QzTrayService {
  constructor() {


}

  errorHandler(error: any): Observable<any> {
    return throwError(error);
  }
    
  // Get list of printers connected
  getPrinters(): Observable<string[]> {
    return from(qz.websocket.connect().then(() => qz.printers.find()))
      .map((printers: string[]) => printers)
      .catch(this.errorHandler);
  }
    
  // Get the SPECIFIC connected printer
  getPrinter(printerName: string): Observable<string> {
    return from(qz.websocket.connect().then(() => qz.printers.find(printerName)))
      .map((printer: string) => printer)
      .catch(this.errorHandler);
  }
    
  // Print data to chosen printer
  printData(printer: string, data: any): Observable<any> {
    // Create a default config for the found printer
    const config = qz.configs.create(printer,{ rasterize: "false"});
    return from(qz.print(config, data))
      .map((anything: any) => anything)
      .catch(this.errorHandler);
  }
   
  // Disconnect QZ Tray from the browser
  removePrinter(): void {
     qz.websocket.disconnect();
  }
}