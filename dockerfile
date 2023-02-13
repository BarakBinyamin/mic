# Stage 1: Build UI 
FROM node:18 AS ui-builder
WORKDIR /usr/src/view
COPY    view .
RUN     npm install
RUN     npm run build

# Stage 2: Copy only dist from the last stage
FROM    nikolaik/python-nodejs:python3.11-nodejs19-slim	
RUN     apt-get -y update && apt-get install -y ffmpeg atomicparsley
WORKDIR /usr/src/view/dist
COPY    --from=ui-builder /usr/src/view/dist .
WORKDIR /usr/src/backend
COPY    /backend/package.*  .
RUN     npm install
COPY    /backend .

ENTRYPOINT [ "node", "index.js", "--port", "3000"]