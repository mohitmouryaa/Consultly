# Use Node 20 as base image
FROM node:20-bullseye

# Set environment variables
ENV REACT_NATIVE_VERSION=0.76.0
ENV ANDROID_SDK_VERSION=35

# Add Azul's public key and repository
RUN apt-get update && apt-get install -y gnupg curl && \
    curl -s https://repos.azul.com/azul-repo.key | gpg --dearmor -o /usr/share/keyrings/azul.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/azul.gpg] https://repos.azul.com/zulu/deb stable main" | \
    tee /etc/apt/sources.list.d/zulu.list

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    file \
    git \
    ruby-full \
    zulu17-jdk \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/zulu17

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
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/35.0.0

# Download and set up Android command line tools
RUN curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip \
    && mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && unzip cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm cmdline-tools.zip

# Accept licenses and install Android SDK components for API 35
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" \
    "platforms;android-35" \
    "build-tools;35.0.0" \
    "extras;android;m2repository" \
    "extras;google;m2repository"

# Set up Gradle
ENV GRADLE_HOME=/opt/gradle
ENV PATH=$PATH:$GRADLE_HOME/bin
RUN curl -L https://services.gradle.org/distributions/gradle-8.3-bin.zip -o gradle.zip && \
    mkdir -p ${GRADLE_HOME} && \
    unzip gradle.zip && \
    mv gradle-8.3/* ${GRADLE_HOME} && \
    rm gradle.zip

# Expose necessary ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Metro bundler
CMD ["npm", "start"]