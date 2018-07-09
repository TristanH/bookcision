using System;
using System.Configuration;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Shared.Protocol;
using System.Collections.Specialized;

namespace ConfigureBlobService
{
    class Program
    {
        static void Main(string[] args)
        {
            NameValueCollection appSettings = ConfigurationManager.AppSettings;
            Console.WriteLine("Configuring CORS on the Windows Azure BLOB service");
            SetsServiceProperties(new Uri(appSettings["StorageUri"]), appSettings["AccountName"], appSettings["AccountKey"]);
        }

        static void SetsServiceProperties(Uri blobEndpoint, string accountName, string accountKey)
        {
            CloudBlobClient client =
                new CloudBlobClient(blobEndpoint, new StorageCredentials(accountName, accountKey));

            // Set the service properties.
            ServiceProperties sp = client.GetServiceProperties();
            sp.DefaultServiceVersion = "2013-08-15";

            CorsRule cr = new CorsRule();
            cr.AllowedHeaders.Add("*");
            cr.AllowedMethods = CorsHttpMethods.Get;
            cr.AllowedOrigins.Add("*");
            //cr.AllowedOrigins.Add("http://kindle.amazon.com");
            //cr.AllowedOrigins.Add("https://kindle.amazon.com");
            //cr.AllowedOrigins.Add("http://read.amazon.com");
            //cr.AllowedOrigins.Add("https://read.amazon.com");
            cr.MaxAgeInSeconds = 5;
            sp.Cors.CorsRules.Clear();
            sp.Cors.CorsRules.Add(cr);

            client.SetServiceProperties(sp);

            ServiceProperties finalSp = client.GetServiceProperties();
            Console.WriteLine(finalSp);
        }
    }
}