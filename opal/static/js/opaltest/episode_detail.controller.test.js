describe('EpisodeDetailCtrl', function(){
    "use strict";

    var $scope, $cookieStore, $modal;
    var $rootScope, $q, $controller;
    var Flow, Episode, episode;
    var controller;

    var profile = {
        readonly   : false,
        can_extract: true,
        can_see_pid: function(){return true; }
    };

    var options = {
        condition: ['Another condition', 'Some condition'],
        tag_hierarchy :{'tropical': []}
    }

    var episodeData = {
        id: 123,
        active: true,
        prev_episodes: [],
        next_episodes: [],
        demographics: [{
            id: 101,
            name: 'John Smith',
            date_of_birth: '1980-07-31'
        }],
        tagging: [{'mine': true, 'tropical': true}],
        location: [{
            category: 'Inepisode',
            hospital: 'UCH',
            ward: 'T10',
            bed: '15',
            date_of_admission: '2013-08-01',
        }],
        diagnosis: [{
            id: 102,
            condition: 'Dengue',
            provisional: true,
        }, {
            id: 103,
            condition: 'Malaria',
            provisional: false,
        }]
    };

    var columns = {
        "default": [
            {
                name: 'demographics',
                single: true,
                fields: [
                    {name: 'name', type: 'string'},
                    {name: 'date_of_birth', type: 'date'},
                ]},
            {
                name: 'location',
                single: true,
                fields: [
                    {name: 'category', type: 'string'},
                    {name: 'hospital', type: 'string'},
                    {name: 'ward', type: 'string'},
                    {name: 'bed', type: 'string'},
                    {name: 'date_of_admission', type: 'date'},
                    {name: 'tags', type: 'list'},
                ]},
            {
                name: 'diagnosis',
                single: false,
                fields: [
                    {name: 'condition', type: 'string'},
                    {name: 'provisional', type: 'boolean'},
                ]},
        ]
    };
    var fields = {}
    _.each(columns.default, function(c){
        fields[c.name] = c;
    });

    beforeEach(function(){
        module('opal');
        inject(function($injector){
            $rootScope   = $injector.get('$rootScope');
            $scope       = $rootScope.$new();
            $q           = $injector.get('$q');
            $controller  = $injector.get('$controller');
            $cookieStore = $injector.get('$cookieStore');
            $modal       = $injector.get('$modal');
            Episode      = $injector.get('Episode');
        });

        $rootScope.fields = fields
        episode = new Episode(angular.copy(episodeData));
        Flow = jasmine.createSpy('Flow').and.callFake(function(){return {then: function(){}}});

        controller = $controller('EpisodeDetailCtrl', {
            $scope      : $scope,
            $modal      : $modal,
            $cookieStore: $cookieStore,
            Flow        : Flow,
            episode     : episode,
            options     : options,
            profile     : profile
        });
    });

    describe('initialization', function(){
        it('should set up state', function(){
            expect($scope.episode).toEqual(episode);
        });
    });

    describe('discharging an episode', function(){
        var mockEvent;

        beforeEach(function(){
            mockEvent = {preventDefault: function(){}};
        });

        it('should call the exit flow', function(){
            $scope.dischargeEpisode(mockEvent);
            expect(Flow).toHaveBeenCalledWith(
                'exit', null, options,
                {
                    current_tags: {
                        tag   : undefined,
                        subtag: undefined
                    },
                    episode: episode

                }
            );
        });

        describe('for a readonly user', function(){
            beforeEach(function(){
                profile.readonly = true;
            });

            it('should return null', function(){
                expect($scope.dischargeEpisode(mockEvent)).toBe(null);
            });

            afterEach(function(){
                profile.readonly = false;
            });
        });
    });

});
