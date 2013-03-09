<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Search extends My_Layout_User_Logged_Controller {

    public function before()
    {
        parent::before();
        Helper_Mainmenu::setActiveItem('search');
    }

    public function action_index()
    {
        $data['types'] = ORM::factory('Type')->find_all();
        $this->setTitle('Search Page')
            ->view('search/index', $data)
            ->render();
    }
    public function action_show_map()
    {
        Helper_Output::factory()->link_js('search/map');
        $this->setTitle('Map Page')
            ->view('search/map')
            ->render();
    }

}
