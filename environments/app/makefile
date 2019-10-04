tag := $(shell date +"%s")

repository ?= lynchrj
namespace ?= awayteam

.PHONY: check build push update dev build-dev

builder = REPOSITORY=${repository} TAG=${tag} docker-compose -f docker-compose.yaml -f docker-compose.build.yaml build --parallel $(1);

pusher = REPOSITORY=${repository} TAG=${tag} docker-compose -f docker-compose.yaml -f docker-compose.build.yaml push $(1);
tag_latest = docker tag ${repository}/app-$(1):${tag} ${repository}/app-$(1):latest && docker push ${repository}/app-$(1):latest;

updater = kubectl set image deployments/$(1) $(1)=${repository}/app-$(1):${tag} -n ${namespace};

dev-builder = docker-compose build --parallel $(1);

starter = docker-compose up $(1);

define check
	ifeq ($(strip $(services)),)
		$(error services must be set)
	endif
endef

build: check
	$(call builder,$(services))

push: check build
	$(foreach service,$(services),$(call tag_latest,$(service)))
	$(foreach service,$(services),$(call pusher,$(service)))

update: check push
	$(foreach service,$(services),$(call updater,$(service)))

build-dev: check 
	$(call dev-builder,$(services))

dev: check build-dev
	$(call starter,$(services))

storybook:
	docker-compose -f docker-compose.storybook.yaml up

down:
	docker-compose down
