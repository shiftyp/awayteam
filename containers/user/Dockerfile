FROM ruby

# basics
RUN apt update
RUN apt -y install openssl curl netcat

# Install Chrome
RUN curl https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /chrome.deb
RUN apt install -y /chrome.deb
RUN rm /chrome.deb

WORKDIR /usr/src/app

COPY ./user/Gemfile ./
RUN /bin/bash -l -c "bundle install"

COPY ./user .
COPY ./waitfor.sh .

CMD ["/bin/bash", "-l", "-c", "ruby ./run.rb"]