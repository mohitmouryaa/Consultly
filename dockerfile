# Use a specific node version that's compatible with RN 0.76
FROM node:20-bullseye

# Set environment variables
ENV REACT_NATIVE_VERSION=0.76.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    file \
    git \
    ruby-full \
    openjdk-11-jdk \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install specific version of React Native CLI
RUN npm install -g react-native-cli@2.0.1

# Install Ruby dependencies
RUN gem install bundler:2.4.22 && \
    gem install cocoapods:1.15.2

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set up Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

RUN curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip \
    && mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && unzip cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm cmdline-tools.zip

RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Expose necessary ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Metro bundler
CMD ["npm", "start"]