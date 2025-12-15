"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrowserWindow } from "./BrowserWindow";
import { LinkInterceptor, InterceptedLink } from "./LinkInterceptor";
import { Globe, Link, ExternalLink, Mail, Phone, Folder } from "lucide-react";
import { Flex } from "@radix-ui/themes";

export function BrowserDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [showGlobalInterceptor, setShowGlobalInterceptor] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            BrowserWindow Demo
          </CardTitle>
          <CardDescription>
            Demonstrate the BrowserWindow component that opens all links in draggable browser windows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowDemo(!showDemo)}>
              {showDemo ? "Hide" : "Show"} Browser Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowGlobalInterceptor(!showGlobalInterceptor)}
            >
              {showGlobalInterceptor ? "Disable" : "Enable"} Global Link Interception
            </Button>
          </div>

          {showDemo && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Demo Content with Links</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Click any link below - they will all open in browser windows instead of navigating away
                </p>
                <div className="space-y-2">
                  <div>
                    <strong>External Links:</strong>
                    <div className="flex gap-2 mt-1">
                      <a href="https://example.com" className="text-blue-600 hover:underline">
                        Example.com
                      </a>
                      <a href="https://httpbin.org" className="text-blue-600 hover:underline">
                        HTTPBin
                      </a>
                      <a href="https://jsonplaceholder.typicode.com" className="text-blue-600 hover:underline">
                        JSONPlaceholder
                      </a>
                    </div>
                  </div>

                  <div>
                    <strong>Internal Links:</strong>
                    <div className="flex gap-2 mt-1">
                      <a href="/about" className="text-green-600 hover:underline">
                        About Page
                      </a>
                      <a href="/contact" className="text-green-600 hover:underline">
                        Contact Page
                      </a>
                      <a href="./products" className="text-green-600 hover:underline">
                        Products
                      </a>
                    </div>
                  </div>

                  <div>
                    <strong>Protocol Links:</strong>
                    <div className="flex gap-2 mt-1">
                      <a href="mailto:test@example.com" className="text-purple-600 hover:underline">
                        Email Us
                      </a>
                      <a href="tel:+1234567890" className="text-purple-600 hover:underline">
                        Call Us
                      </a>
                      <a href="ftp://example.com" className="text-purple-600 hover:underline">
                        FTP Site
                      </a>
                    </div>
                  </div>

                  <div>
                    <strong>Anchor Links:</strong>
                    <div className="flex gap-2 mt-1">
                      <a href="#section1" className="text-orange-600 hover:underline">
                        Section 1
                      </a>
                      <a href="#section2" className="text-orange-600 hover:underline">
                        Section 2
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BrowserWindow
                  initialUrl="https://example.com"
                  title="Example Browser"
                  defaultPosition={{ x: 50, y: 50 }}
                  className="mb-4"
                />

                <BrowserWindow
                  initialUrl="https://httpbin.org/html"
                  title="HTTPBin Demo"
                  defaultPosition={{ x: 400, y: 50 }}
                  config={{
                    blockedDomains: ['google.com'], // Block Google in this window
                  }}
                />
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Iframe Limitations Notice</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Many major websites (Google, Facebook, Twitter, etc.) block iframe embedding for security reasons.
                  This is normal browser behavior - these sites use X-Frame-Options headers to prevent clickjacking attacks.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Working Examples:</strong> Try sites like example.com, httpbin.org, or any site that allows iframe embedding.
                  The system will show helpful error messages for blocked sites.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            LinkInterceptor Features
          </CardTitle>
          <CardDescription>
            Different ways to intercept and handle links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Global Link Interceptor</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Wraps the entire app and intercepts all links globally
              </p>
              {showGlobalInterceptor && (
                <LinkInterceptor
                  config={{
                    blockedDomains: ['facebook.com', 'twitter.com'], // Block social media
                  }}
                >
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <p className="text-sm">
                      Global interception is now active! All links in this section will open in browser windows.
                    </p>
                    <div className="mt-2 space-y-1">
                      <a href="https://www.example.com" className="text-blue-600 hover:underline block">
                        Example.com
                      </a>
                      <a href="mailto:demo@example.com" className="text-blue-600 hover:underline block">
                        demo@example.com
                      </a>
                    </div>
                  </div>
                </LinkInterceptor>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2. InterceptedLink Component</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Individual link components that are always intercepted
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded space-y-2">
                <InterceptedLink href="https://example.com">
                  Example Website
                </InterceptedLink>
                <InterceptedLink href="https://httpbin.org/forms/post">
                  HTTPBin Forms
                </InterceptedLink>
                <InterceptedLink href="mailto:support@company.com">
                  Contact Support
                </InterceptedLink>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">3. Force New Windows</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each link click creates a brand new browser window
              </p>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                <p className="text-sm mb-2">
                  <strong>Click each link below</strong> - each will open in a separate new window:
                </p>
                <LinkInterceptor forceNewWindow={true}>
                  <div className="space-y-1">
                    <a href="https://example.com" className="text-blue-600 hover:underline block">
                      Example.com (New Window #1)
                    </a>
                    <a href="https://httpbin.org/html" className="text-blue-600 hover:underline block">
                      HTTPBin HTML (New Window #2)
                    </a>
                    <a href="https://jsonplaceholder.typicode.com" className="text-blue-600 hover:underline block">
                      JSONPlaceholder (New Window #3)
                    </a>
                  </div>
                </LinkInterceptor>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">4. Smart Window Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Links share the same window (updates instead of creating new)
              </p>
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
                <p className="text-sm mb-2">
                  <strong>Click these links</strong> - they all use the same window:
                </p>
                <LinkInterceptor>
                  <div className="space-y-1">
                    <a href="https://example.com" className="text-blue-600 hover:underline block">
                      Example.com (Shared Window)
                    </a>
                    <a href="https://httpbin.org/forms/post" className="text-blue-600 hover:underline block">
                      HTTPBin Forms (Same Window)
                    </a>
                    <a href="https://jsonplaceholder.typicode.com/posts/1" className="text-blue-600 hover:underline block">
                      JSONPlaceholder Post (Same Window)
                    </a>
                  </div>
                </LinkInterceptor>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">5. Security Features</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configurable security and domain filtering
              </p>
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded space-y-2">
                <p className="text-sm font-medium">Blocked domains:</p>
                <ul className="text-sm space-y-1">
                  <li>• facebook.com</li>
                  <li>• twitter.com</li>
                  <li>• Malicious sites</li>
                </ul>
                <p className="text-sm font-medium mt-2">Allowed protocols:</p>
                <ul className="text-sm space-y-1">
                  <li>• http:, https:</li>
                  <li>• mailto:, tel:</li>
                  <li>• Blocked: javascript:, data:</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            How to integrate BrowserWindow into your app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`// 1. Basic BrowserWindow
<BrowserWindow
  initialUrl="https://example.com"
  title="My Browser"
/>

// 2. With custom security config
<BrowserWindow
  initialUrl="https://trusted-site.com"
  config={{
    allowedDomains: ['trusted-site.com'],
    blockedDomains: ['malicious-site.com'],
    enableJavaScript: true,
  }}
/>

// 3. Global link interception
<LinkInterceptor>
  <App />
</LinkInterceptor>

// 4. Individual intercepted links
<InterceptedLink href="https://example.com">
  Visit Example
</InterceptedLink>

// 5. Custom link handler
const { interceptLink } = useLinkInterceptor();
interceptLink('https://example.com');`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BrowserDemo;
