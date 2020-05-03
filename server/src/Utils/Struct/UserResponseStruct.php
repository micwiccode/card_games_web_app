<?php


namespace App\Utils\Struct;


use App\Entity\User;

class UserResponseStruct
{
    /** @var int */
    public $id;

    /** @var string */
    public $username;

    /** @var string */
    public $email;

    /** @var array */
    public $roles;

    public static function mapFromUser(User $user): self
    {
        $struct = new UserResponseStruct();
        $struct->email = $user->getEmail();
        $struct->username = $user->getUsername();
        $struct->id = $user->getId();
        $struct->roles = $user->getRoles();
        return $struct;
    }







}