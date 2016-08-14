# coap-router
A quick demo on how to leverage web router to build CoAP server.

## Motivation
Currently I'm working on a Node.js based IoT (Internet of Things) platform. It allows Node.js powered DTU (Data Transfer Unit) to serve as CoAP server on smart devices like Raspberry PI.

When you design a Node.js based HTTP server, web router is one of your best choices to manage incoming requests from clients. Unfortunately, CoAP doesn't have one like Express Router, this project is to demonstrate how to leverage web router concept to simplify CoAP server implementation.
